import {
  controller,
  request,
  response,
  httpPut,
} from 'inversify-express-utils';
import { Response } from 'ioc/ioc';
import { sendRes, Uploader } from 'utils';
import { VERSION, STATIC_PATH, BASE_URL } from 'common';
import { authMiddleware } from 'middleware';

const upload = new Uploader('server/uploads/');

// TODO: multer catch error
// const uploadHandler = (req: any, res: Response, next: NextFunction) => {
//   try {
//     upload.multer.single('file')(req, res, next);
//   } catch (err) {
//     console.log('handler ' + err);
//     sendErr(res, 400, `aa ${err.name}: ${err.message}`);
//   }
// };

@controller(`/${VERSION}`) // 根路由
export default class UploadController {
  @httpPut('/upload', authMiddleware, upload.multer.single('file'))
  async uploadPut(@request() _req: any, @response() res: Response) {
    const url = `${BASE_URL}/${STATIC_PATH}/${upload.fileName}`;

    sendRes(res, 201, 'success', 'upload a file successfully', { url });
  }
}
