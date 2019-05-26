import { Container, inject, unmanaged } from 'inversify';
import {
  autoProvide,
  provide,
  buildProviderModule,
  fluentProvide,
} from 'inversify-binding-decorators';
import { Request, Response } from 'express';
import TYPES from '../constant/types';

// load everything needed to the Container
const container = new Container();

const provideSingleton = (identifier: any) => {
  return fluentProvide(identifier)
    .inSingletonScope()
    .done(true);
};

const provideThrowable = (identifier: any, isThrowable: any) => {
  return fluentProvide(identifier)
    .whenTargetTagged('throwable', isThrowable)
    .done();
};

export {
  container,
  inject,
  unmanaged,
  autoProvide,
  provide,
  buildProviderModule,
  provideThrowable,
  provideSingleton,
  TYPES,
  Request,
  Response,
};
