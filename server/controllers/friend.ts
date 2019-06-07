import {
  controller,
  response,
  request,
  requestParam as reqParam,
  requestBody as reqBody,
  httpGet,
  httpPost,
  httpDelete,
  httpPatch,
} from 'inversify-express-utils';
import { inject, TYPES, Response } from 'ioc/ioc';
import { FriendService, UserService } from 'services';
import { sendRes, getSortedIds } from 'utils';
import { VERSION } from 'common';
import { authMiddleware } from 'middleware';

@controller(`/${VERSION}/friends`, authMiddleware)
export default class FriendController {
  constructor(
    @inject(TYPES.FriendService) private friendService: FriendService,
    @inject(TYPES.UserService) private userService: UserService
  ) {}

  @httpGet('/')
  async getFriends(@request() req: any, @response() res: Response) {
    const { id } = req.user;

    const data: any = await this.friendService.getFriends(
      { $or: [{ user1: id }, { user2: id }], success: true },
      '-password'
    );

    sendRes(res, 200, 'success', 'get friends successfully', data);
  }

  @httpPost('/')
  async applyFriend(@request() req: any, @reqBody() body: any, @response() res: Response) {
    const { id } = req.user;
    const { account } = body;

    // 被请求添加的用户
    const data: any = await this.userService.findOne(
      {
        $or: [{ email: account }, { phone: account }, { name: account }],
      },
      '_id'
    );

    const { _id: userId } = data;

    const friend = await this.friendService.findOne(getSortedIds(id, userId));

    console.log('applyFriend', friend);

    if (friend) {
      sendRes(res, 400, 'fail', 'already be friends or send an application');
      return;
    }

    await this.friendService.save(
      Object.assign(getSortedIds(id, userId), { applicant: id, receiver: userId, success: false })
    );

    sendRes(res, 200, 'success', 'apply to friend successfully');
  }

  @httpGet('/applies')
  async getApplies(@request() req: any, @response() res: Response) {
    const { id } = req.user;

    // TODO: 同意添加后的数据
    const data = await this.friendService.getApplies({ receiver: id, success: false });

    sendRes(res, 200, 'success', 'find applies successfully', data);
  }

  @httpPatch('/:id') // friend model id
  async applyAgreed(@reqParam('id') friendId: string, @response() res: Response) {
    const data = await this.friendService.updateById(friendId, { success: true });

    sendRes(res, 200, 'success', 'add a friend successfully', data);
  }

  // 可用于拒绝添加
  @httpDelete('/:id')
  async deleteFriend(@reqParam('id') friendId: string, @response() res: Response) {
    await this.friendService.deleteById(friendId);

    sendRes(res, 200, 'success', 'delete a friend or application successfully');
  }
}
