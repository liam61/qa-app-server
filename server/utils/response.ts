import httpCode from 'http-status-code';
import { Response } from 'express';
import { IResponse, resType, IErrRes } from '../typings';

function sendRes(
  res: Response,
  status: number,
  type: resType,
  message: string,
  data: any = {},
) {
  const retJson: IResponse = {
    status,
    statusText: httpCode.getMessage(status),
    data: Object.assign({ type, message }, handleResData(data)),
  };

  res.status(status).json(retJson);
}

function sendErr(res: Response, status: number, errmsg: string) {
  const retJson: IErrRes = {
    status,
    statusText: httpCode.getMessage(status),
    data: { errcode: status, errmsg },
  };

  res.status(status).json(retJson);
}

function handleResData(data: any) {
  if (Array.isArray(data)) {
    return { lists: data };
  }

  if (typeof data === 'object') {
    return { ...data };
  }

  return { data };
}

export { sendRes, sendErr };
