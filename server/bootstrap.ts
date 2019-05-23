import 'reflect-metadata';
import { InversifyExpressServer } from 'inversify-express-utils';
import { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import { container } from './ioc/ioc';
import helmet from 'helmet';
import { IErrRes } from './typings';

import './db';

const server = new InversifyExpressServer(container);

server
  .setConfig(app => {
    app.use(bodyParser.urlencoded({ extended: false })); // allow querystring
    app.use(bodyParser.json());
    app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
      );

      if (req.method === 'OPTIONS') {
        res.header(
          'Access-Control-Allow-Methods',
          'PUT, POST, PATCH, DELETE, GET'
        );

        return res.status(204).json({});
      }

      return void next();
    });
    app.use(helmet());
  })
  .setErrorConfig(app => {
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      // { name: 'UnknownError', message: 'oops, something bad. :(' }
      console.log(err.stack);

      res.status(500).json({
        errcode: 500,
        errmsg: `${err.name}: ${err.message}`,
      } as IErrRes);
    });
  });

server
  .build()
  .listen(4000, () =>
    console.log('your server is running at http://localhost:4000 :)')
  );
