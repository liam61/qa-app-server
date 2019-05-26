import {
  controller,
  response,
  // request,
  requestParam as reqParam,
  requestBody as reqBody,
  httpGet,
  httpPost,
  httpPut,
  httpDelete,
  // httpPatch,
} from 'inversify-express-utils';
import jwt from 'jsonwebtoken';
import { inject, TYPES, Response } from '../ioc/ioc';
import { UserService } from '../services';
import { IUser } from '../models/user';
import { sendRes, getUid } from '../utils';
import { VERSION, JWT_KEY } from '../common/global';
import { authMiddleware } from '../middleware';

let validateStr = '';

@controller(`/${VERSION}/users`)
export default class UserController {
  constructor(@inject(TYPES.UserService) private userService: UserService) {}

  @httpGet('/')
  async getUsers(@response() res: Response) {
    const data = await this.userService.findAll();

    data.length
      ? sendRes(res, 200, 'success', 'get users successfully', data)
      : sendRes(res, 404, 'fail', 'no user exists');
  }

  @httpGet('/:id')
  async getUserById(@reqParam('id') id: string, @response() res: Response) {
    const data = await this.userService.findById(id);

    data
      ? sendRes(res, 200, 'success', 'get a user successfully', data)
      : sendRes(res, 400, 'fail', 'user do not exist');
  }

  //  async createUser(req: Request, @response() res: Response) {
  @httpPost('/signup')
  async createUser(@reqBody() body: any, @response() res: Response) {
    const { name, password, validate } = body;

    if (validate !== validateStr) {
      const validateError = new Error('illegal signup without validate');
      validateError.name = 'ValidateError';
      throw validateError;
    }

    // await this.userService.createUser(name, password);
    await this.userService.save({ name, password });

    sendRes(res, 201, 'success', 'create a user successfully');
  }

  @httpPost('/login')
  async login(@reqBody() body: any, @response() res: Response) {
    const { account, password, validate } = body;
    // console.log(validateStr);

    if (validate !== validateStr) {
      const validateError = new Error('illegal login without validate');
      validateError.name = 'ValidateError';
      throw validateError;
    }

    const {
      match,
      user: { _id, name },
    } = await this.userService.login(account, password);

    if (match) {
      const token = jwt.sign({ id: _id, name }, JWT_KEY, { expiresIn: '1h' });

      sendRes(res, 200, 'success', 'login successfully', { token });

      return;
    }

    sendRes(res, 401, 'fail', 'login failed');
  }

  // for login and signup
  @httpGet('/validate/:account')
  async validateAccount(
    @reqParam('account') account: string,
    @response() res: Response
  ) {
    const exist = await this.userService.validateAccount(account);

    validateStr = getUid();

    sendRes(
      res,
      200,
      'success',
      exist ? 'account is available' : 'account already exists',
      { exist, validate: validateStr }
    );
  }

  @httpPut('/:id', authMiddleware)
  async updateUser(
    @reqParam('id') id: string,
    @reqBody() body: IUser,
    @response() res: Response
  ) {
    await this.userService.update(id, body);

    sendRes(res, 200, 'success', 'update user successfully');
  }

  @httpDelete('/:id', authMiddleware)
  async deleteUser(@reqParam('id') id: string, @response() res: Response) {
    await this.userService.deleteById(id);

    sendRes(res, 200, 'success', 'delete a user successfully');
  }
}
