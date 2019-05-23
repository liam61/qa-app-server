type resType = 'success' | 'fail';

interface IResponse {
  status: number;
  statusText: string;
  data: { type: resType; message: string; [key: string]: any };
}

interface IErrRes {
  errcode: number;
  errmsg: string;
}

export { IResponse, IErrRes, resType };
