import { Request, Response, NextFunction } from 'ioc/ioc';
import { CLIENT_URL } from 'common';

const defaultResponse = (req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', CLIENT_URL);
  res.header('Access-Control-Allow-Credentials', 'true');
  // res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.header('Access-Control-Max-Age', '3600');

    res.status(204).json({});

    return;
  }

  next();
};

export default defaultResponse;
