import { connect, connection, ConnectionOptions } from 'mongoose';
import { CONN_STR } from 'common';

const defaultOpts: ConnectionOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  // user: 'username',
  // pass: 'password',
};

class MongoDBClient {
  static instance: MongoDBClient;

  constructor(url: string, options: ConnectionOptions) {
    connect(url, options);

    // mongoose.Promise = global.Promise; // 使用原生 Promise
    this.initListeners();
  }

  static getInstance(url: string, options: ConnectionOptions) {
    if (!this.instance) {
      this.instance = new MongoDBClient(url, options);
    }

    return this.instance;
  }

  initListeners() {
    connection.on('connected', () => console.log('mongodb connection succeed'));

    connection.on('error', error => console.log('mongodb connection failed', error));

    connection.on('disconnected', error => console.log('mongodb is disconnected', error));
  }
}

export default MongoDBClient.getInstance(CONN_STR, defaultOpts);
