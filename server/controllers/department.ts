import { IDepartment } from 'models/department';
import {
  controller,
  response,
  // request,
  requestParam as reqParam,
  requestBody as reqBody,
  httpGet,
  httpPost,
  // httpDelete,
} from 'inversify-express-utils';
import { inject, TYPES, Response } from 'ioc/ioc';
import { DepartmentService } from 'services';
import { sendRes } from 'utils';
import { VERSION } from 'common';
// import { authMiddleware } from 'middleware';

@controller(`/${VERSION}/departments`)
export default class DepartmentController {
  constructor(@inject(TYPES.DepartmentService) private dptService: DepartmentService) {}

  @httpGet('/')
  async getDepts(@response() res: Response) {
    const data = await this.dptService.findAll();

    sendRes(res, 200, 'success', 'get departments successfully', data);
  }

  @httpGet('/:id')
  async getDptById(@reqParam('id') id: string, @response() res: Response) {
    const data = await this.dptService.findById(id);

    sendRes(res, 200, 'success', 'get a department successfully', data);
  }

  @httpPost('/')
  async createDpt(@reqBody() body: IDepartment, @response() res: Response) {
    await this.dptService.save(body);

    sendRes(res, 201, 'success', 'create a department successfully');
  }
}
