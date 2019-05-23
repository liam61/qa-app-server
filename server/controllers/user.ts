import {
  controller,
  // request,
  response,
  requestParam as reqParam,
  requestBody as reqBody,
  httpGet,
  httpPost,
  httpPut,
  httpDelete,
  // httpPatch,
} from 'inversify-express-utils';
import { inject, TYPES, Response } from '../ioc/ioc';
import { UserService } from '../services/user';
import { IUser } from '../models/user';
import { sendRes } from '../utils';
import { VERSION } from '../common/global';

@controller(`/${VERSION}/users`)
export class UserController {
  constructor(@inject(TYPES.UserService) private userService: UserService) {}

  @httpGet('/')
  public async getUsers(@response() res: Response) {
    const data = await this.userService.getUsers();

    data.length
      ? sendRes(res, 200, 'success', 'find users successfully', data)
      : sendRes(res, 404, 'fail', 'no user exists');
  }

  @httpGet('/:id')
  public async getUserById(
    @reqParam('id') id: string,
    @response() res: Response
  ) {
    const data = await this.userService.getUserById(id);

    data
      ? sendRes(res, 200, 'success', 'find a user successfully', data)
      : sendRes(res, 400, 'fail', 'user do not exist');
  }

  // public async createUser(req: Request, @response() res: Response) {
  @httpPost('/signup')
  public async createUser(@reqBody() body: IUser, @response() res: Response) {
    const { name, password } = body as IUser;

    await this.userService.createUser(name, password);

    sendRes(res, 201, 'success', 'create a user successfully');
  }

  @httpPut('/:id')
  public async updateUser(
    @reqParam('id') id: string,
    @reqBody() body: IUser,
    @response() res: Response
  ) {
    await this.userService.updateUser(id, body);

    sendRes(res, 200, 'success', 'update user successfully');
  }

  @httpDelete('/:id')
  public async deleteUser(
    @reqParam('id') id: string,
    @response() res: Response
  ) {
    await this.userService.deleteUser(id);

    sendRes(res, 200, 'success', 'delete a user successfully');
  }
}
