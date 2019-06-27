import { controller } from 'inversify-express-utils';
import { VERSION } from 'common';
import { authMiddleware } from 'middleware';

@controller(`/${VERSION}/qstDetails`, authMiddleware)
export default class QstDetailController {}
