import 'reflect-metadata';
import { InversifyExpressServer } from 'inversify-express-utils';
import { makeLoggerMiddleware } from 'inversify-logger-middleware';
import bodyParser from 'body-parser';
import { defaultResMiddleware, errorMiddleware } from './middleware';
import { container, buildProviderModule } from './ioc/ioc';
import helmet from 'helmet';

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
    app.use(bodyParser.urlencoded({ extended: false })); // allow querystring
    app.use(bodyParser.json());
    app.use(defaultResMiddleware);
    app.use(helmet());
  })
  .setErrorConfig(app => app.use(errorMiddleware));

server
  .build()
  .listen(4000, () =>
    console.log('your server is running at http://localhost:4000 :)'),
  );
