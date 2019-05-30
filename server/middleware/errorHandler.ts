import { sendErr } from '../utils';
import { Request, Response, NextFunction } from '../ioc/ioc';

const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.log(err.stack);

  sendErr(res, 500, `${err.name}: ${err.message}`);
};

export default errorHandler;
