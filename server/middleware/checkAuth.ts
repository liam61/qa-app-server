import jwt from 'jsonwebtoken';
import { sendRes } from 'utils';
import { Response, NextFunction } from 'ioc/ioc';
import { JWT_KEY } from 'common';

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
    sendRes(res, 401, 'fail', `${err.name}: ${err.message}`);
  }
};

export default checkAuth;
