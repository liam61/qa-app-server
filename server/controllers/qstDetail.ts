import {
  controller,
  // response,
  // request,
  // requestParam as reqParam,
  // requestBody as reqBody,
  // httpGet,
  // httpPost,
  // httpPut,
  // httpDelete,
  // httpPatch,
} from 'inversify-express-utils';
// import { inject, TYPES } from '../ioc/ioc';
// import { QstDetailService } from '../services';
// import { IQuestion } from './../models/question';
// import { sendRes } from '../utils';
import { VERSION } from '../common/global';
// import { authMiddleware } from '../middleware';

@controller(`/${VERSION}/qstDetails`)
export default class QstDetailController {}
