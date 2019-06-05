import { IMessage } from './../models/message';
import expressWs, { Application, Options } from 'express-ws';
import ws, { Data } from 'ws';
// import { Server as hServer, IncomingMessage } from 'http';
import { Server as hServer } from 'http';
import { Server as hsServer } from 'https';
import { emptyFn } from '../utils';

const defaultOpts: Options = {
  wsOptions: {
    verifyClient: (info: any) => {
      const { url } = info.req;
      // TODO: ??
      // console.log('verifyClient', url);
      // const { authorization } = req.headers;

      if (!url) {
        const clientError = new Error('illegal client');
        clientError.name = 'clientError';
        // throw clientError;
      }

      return true;
    },
  },
};

class WSController {
  static instance: WSController;

  wsServer: expressWs.Instance;

  // userIdList = []; // 上线的用户 id
  // clients: Set<ws>;
  clientMap: Map<string, ws>;

  constructor(
    private path: string,
    private app: Application,
    private server?: hServer | hsServer,
    private options?: Options
  ) {
    this.wsServer = expressWs(this.app, this.server, this.options);

    this.app.ws(this.path, this.wsMiddleWare);

    this.clientMap = new Map();
    // this.clients = this.wsServer.getWss().clients;

    this.initHeartbeat();
  }

  static getInstance(path: string, app: Application, server?: hServer | hsServer, options: Options = defaultOpts) {
    if (!this.instance) {
      this.instance = new WSController(path, app, server, options);
    }

    return this.instance;
  }

  wsMiddleWare = (wServer: any, req: any) => {
    // const { id } = req.user || { id: getUid(4) };
    const { id } = req.params;
    console.log('wsMiddleWare', id);

    wServer.id = id;
    wServer.isAlive = true;
    this.clientMap.set(id, wServer);
    // wServer.send(`后台传来的信息！clientId: ${id}`);

    wServer.on('message', (data: Data) => {
      console.log('message', data);
      const { to, content }: IMessage = JSON.parse(data.toString());
      console.log('to', to, content);

      this.sendMsgToClientById(to, content);
    });

    wServer.on('pong', () => {
      wServer.isAlive = true;
    });

    wServer.on('close', (closeCode: number) => {
      // this.clientMap.delete(id);
      console.log(`a client has disconnected, closeCode: ${closeCode}`);
    });
  };

  initHeartbeat(during: number = 10000) {
    return setInterval(() => {
      this.clientMap.forEach((client: any) => {
        if (!client.isAlive) {
          console.log(`a client has timed out, clientId: ${client.id}`);
          this.clientMap.delete(client.id);

          return client.terminate();
        }

        client.isAlive = false;
        client.ping(emptyFn);
      });
    }, during);
  }

  sendMsgToClientById(id: string, data: Data) {
    const client: any = this.clientMap.get(id);

    if (client) {
      client!.send(data);
    }
  }

  broadcast(data: Data) {
    this.clientMap.forEach((client: any) => {
      // if (client.readyState === ws.OPEN) {
      if (client.isAlive) {
        client.send(data);
      }
    });
  }
}

export default WSController.getInstance;
