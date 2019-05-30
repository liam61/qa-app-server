import httpCode from 'http-status-code';
import { Response } from 'express';
// import { IResponse, resType, IErrRes } from '../typings';
import { resType } from '../typings';

function sendRes(
  res: Response,
  status: number,
  type: resType,
  message: string,
  data?: any,
) {
  const retJson = {
    status,
    statusText: httpCode.getMessage(status),
    type,
    message,
    data,
  };

  res.status(200).json(retJson);
}

function sendErr(res: Response, status: number, errmsg: string) {
  const retJson = { errcode: status, errmsg };

  res.status(200).json(retJson);
}

export { sendRes, sendErr };
