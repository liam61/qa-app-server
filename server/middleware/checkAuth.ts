import jwt from 'jsonwebtoken';
import { sendErr } from '../utils';
import { Response, NextFunction } from 'express';
import { JWT_KEY } from '../common/global';

const checkAuth = (req: any, res: Response, next: NextFunction) => {
  try {
    // const decoded = jwt.verify(req.body.token, process.env.JWT_KEY); // token 放到 body 中
    // 放到请求 header 中 Authorization: Bearer token（两者以空格连接）
    const { authorization } = req.headers;

    if (!authorization) {
      const headerError = new Error('no request header authorization');
      headerError.name = 'HeaderError';
      throw headerError;
    }

    const token = authorization.split(' ').pop();
    const decoded = jwt.verify(token, JWT_KEY);

    req.user = decoded;

    next();
  } catch (err) {
    sendErr(res, 401, `${err.name}: ${err.message}`);
  }
};

export default checkAuth;
