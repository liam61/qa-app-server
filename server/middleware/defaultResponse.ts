import { Request, Response, NextFunction } from 'ioc/ioc';
import { HOST, SERVER_PORT } from 'common';

const defaultResponse = (req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', `http://${HOST}:${SERVER_PORT}`);
  res.header('Access-Control-Allow-Credentials', 'true');
  // res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');

    res.status(204).json({});

    return;
  }

  next();
};

export default defaultResponse;
