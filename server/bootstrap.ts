import 'reflect-metadata';
import { InversifyExpressServer } from 'inversify-express-utils';
import { makeLoggerMiddleware } from 'inversify-logger-middleware';
import bodyParser from 'body-parser';
import { defaultResMiddleware, errorMiddleware } from './middleware';
import { container, buildProviderModule, serverStatic } from './ioc/ioc';
import helmet from 'helmet';
import { resolve } from './utils';
import { PORT, STATIC_PATH } from './common/global';

import './db';
import './ioc/loader';

// Reflects all decorators provided by this package and packages them into
// a module to be loaded by the container
container.load(buildProviderModule());

if (process.env.NODE_ENV === 'development') {
  const logger = makeLoggerMiddleware();
  container.applyMiddleware(logger);
}

const server = new InversifyExpressServer(container);

server
  .setConfig(app => {
    app.use(`/${STATIC_PATH}`, serverStatic(resolve('server/uploads')));
    app.use(bodyParser.urlencoded({ extended: false })); // allow querystring
    app.use(bodyParser.json());
    app.use(defaultResMiddleware);
    app.use(helmet());
  })
  .setErrorConfig(app => app.use(errorMiddleware));

server
  .build()
  .listen(PORT, () =>
    console.log(`your server is running at http://localhost:${PORT} :)`),
  );
