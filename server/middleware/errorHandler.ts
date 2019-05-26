import { sendErr } from '../utils';
import { Request, Response } from 'express';

const errorHandler = (err: any, _req: Request, res: Response) => {
  console.log(err.stack);

  sendErr(res, 500, `${err.name}: ${err.message}`);
};

export default errorHandler;
