import { Container, inject } from 'inversify';
import {
  autoProvide,
  provide,
  buildProviderModule,
  fluentProvide,
} from 'inversify-binding-decorators';
import { makeLoggerMiddleware } from 'inversify-logger-middleware';
import { Request, Response } from 'express';
import TYPES from '../constant/types';
import './loader';

// load everything needed to the Container
const container = new Container();

// const provideSingleton = (identifier: any) => {
//   return fluentProvide(identifier)
//     .inSingletonScope()
//     .done();
// };

const provideThrowable = (identifier: any, isThrowable: any) => {
  return fluentProvide(identifier)
    .whenTargetTagged('throwable', isThrowable)
    .done();
};

// Reflects all decorators provided by this package and packages them into
// a module to be loaded by the container
container.load(buildProviderModule());

if (process.env.NODE_ENV === 'development') {
  const logger = makeLoggerMiddleware();
  container.applyMiddleware(logger);
}

export {
  container,
  autoProvide,
  provide,
  provideThrowable,
  inject,
  TYPES,
  Request,
  Response,
};
