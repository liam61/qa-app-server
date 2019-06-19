import {
  controller,
  response,
  request,
  requestParam as reqParam,
  requestBody as reqBody,
  httpGet,
  httpPost,
  httpPut,
  httpDelete,
  // httpPatch,
} from 'inversify-express-utils';
import jwt from 'jsonwebtoken';
import { inject, TYPES, Response } from 'ioc/ioc';
import { UserService, DepartmentService, FriendService, MessageService } from 'services';
import { IUser } from 'models/user';
import { sendRes, getUid, getSortedIds } from 'utils';
import { VERSION, JWT_KEY, ROOT_USER, BASE_URL, STATIC_PATH } from 'common';
import { authMiddleware } from 'middleware';

let validateStr = '';

@controller(`/${VERSION}/users`)
export default class UserController {
  constructor(
    @inject(TYPES.UserService) private userService: UserService,
    @inject(TYPES.DepartmentService) private dptService: DepartmentService,
    @inject(TYPES.FriendService) private friendService: FriendService,
    @inject(TYPES.MessageService) private msgService: MessageService
  ) {}

  @httpGet('/', authMiddleware)
  async getUsers(@response() res: Response) {
    const data = await this.userService.findAll(null, '-password');

    sendRes(res, 200, 'success', 'get users successfully', data);
    // : sendRes(res, 404, 'fail', 'no user exists');
  }

  @httpGet('/:id', authMiddleware)
  async getUserById(@reqParam('id') id: string, @response() res: Response) {
    const data = await this.userService.findById(id, '-password');

    sendRes(res, 200, 'success', 'get a user successfully', data);
    // : sendRes(res, 404, 'fail', 'user do not exist');
  }

  @httpPost('/signup')
  async createUser(@reqBody() body: any, @response() res: Response) {
    const { name, password, validate, dptId } = body;

    if (validate !== validateStr) {
      const validateError = new Error('illegal signup without validate');
      validateError.name = 'ValidateError';
      throw validateError;
    }

    const { _id: userId }: any = await this.userService.createUser({
      name,
      password,
      department: dptId,
      avatar: `${BASE_URL}/${STATIC_PATH}/default-avatar.jpg`,
      gender: 'male',
      profile: 'edit profile',
    });

    // link department
    const { staff }: any = await this.dptService.findById(dptId, 'staff');
    staff.push({ user: userId });
    await this.dptService.updateById(dptId, { staff });

    if (name !== ROOT_USER) {
      // link friend to root user
      const { _id: rootId }: any = await this.userService.findOne({ name: ROOT_USER }, '_id');
      const { _id: friend } = await this.friendService.save(
        Object.assign(getSortedIds(rootId, userId), { applicant: userId, receiver: rootId, success: true })
      );

      // link first message
      const { _id } = await this.msgService.save({
        friend,
        from: rootId,
        to: userId,
        content: '我们已经是好友了，开始聊天吧！',
        type: 'text',
      });
      await this.friendService.updateById(friend, { lastMessage: _id });
    }

    sendRes(res, 201, 'success', 'create a user successfully');
  }

  @httpPost('/login')
  async login(@reqBody() body: any, @response() res: Response) {
    const { account, password, validate } = body;

    if (validate !== validateStr) {
      const validateError = new Error('illegal login without validate');
      validateError.name = 'ValidateError';
      throw validateError;
    }

    const {
      matched,
      user: { _id: id, name },
    } = await this.userService.login(account, password);

    if (matched) {
      const token = jwt.sign({ id, name }, JWT_KEY, { expiresIn: '1h' });

      sendRes(res, 200, 'success', 'login successfully', { token, id });

      return;
    }

    sendRes(res, 400, 'fail', 'login failed');
  }

  // for login and signup
  @httpGet('/validate/:account')
  async validateAccount(@reqParam('account') account: string, @response() res: Response) {
    const exist = await this.userService.validateAccount(account);

    validateStr = getUid();

    sendRes(res, 200, 'success', exist ? 'account already exists' : 'account is not exist', {
      exist,
      validate: validateStr,
    });
  }

  @httpPut('/:id', authMiddleware)
  async updateUser(@request() req: any, @reqBody() body: IUser, @response() res: Response) {
    const { id } = req.user;

    await this.userService.updateById(id, body);

    sendRes(res, 200, 'success', 'update user successfully');
  }

  @httpDelete('/:id', authMiddleware)
  async deleteUser(@reqParam('id') id: string, @response() res: Response) {
    await this.userService.deleteById(id);

    sendRes(res, 200, 'success', 'delete a user successfully');
  }
}
