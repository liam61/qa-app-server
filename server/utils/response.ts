import httpCode from 'http-status-code';
import { Response } from 'express';

type resType = 'success' | 'fail' | 'info';

interface IResponse {
  status: number;
  statusText: string;
  data?: { type: resType; message: string; [key: string]: any };
  lists?: any[];
}

interface IErrRes {
  status: number;
  statusText: string;
  data: { errcode: number; errmsg: string };
}

// export { IResponse, IErrRes, resType };

function sendRes(res: Response, status: number, type: resType, message: string, data?: any) {
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

export { sendRes, sendErr, IResponse, IErrRes, resType };
