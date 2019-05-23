import httpCode from 'http-status-code';
import { Response } from 'express';
import { IResponse, resType } from '../typings';

function sendRes(
  res: Response,
  status: number,
  type: resType,
  message: string,
  data: any = {}
) {
  const retJson: IResponse = {
    status,
    statusText: httpCode.getMessage(status),
    data: { type, message, data },
  };

  res.status(status).json(retJson);
}

export default sendRes;
