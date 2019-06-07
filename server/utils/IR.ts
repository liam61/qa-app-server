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

export { IResponse, IErrRes, resType };
