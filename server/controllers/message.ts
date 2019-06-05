import {
  controller,
  response,
  // request,
  // requestParam as reqParam,
  requestBody as reqBody,
  queryParam,
  httpGet,
  httpPost,
} from 'inversify-express-utils';
import { inject, TYPES, Response } from '../ioc/ioc';
import { MessageService, FriendService } from '../services';
import { sendRes } from '../utils';
import { VERSION } from '../common/global';
import { authMiddleware } from '../middleware';

@controller(`/${VERSION}/messages`, authMiddleware)
export default class MessageController {
  constructor(
    @inject(TYPES.FriendService) private friendService: FriendService,
    @inject(TYPES.MessageService) private msgService: MessageService
  ) {}

  @httpGet('/') // 不能使用 params 参数，因为这里的 id 应该指的是 message model id 而不是 user id
  async getMessages(@queryParam('friendId') friendId: string, @response() res: Response) {
    // const { id: user1 } = req.user;
    // const { _id }: any = await this.friendService.findOne(getSortedIds(user1, user2), { success: true });
    // const { _id }: any = await this.friendService.findById(friendId);
    const data = await this.msgService.findAll({ friend: friendId });

    sendRes(res, 200, 'success', 'get messages successfully', data || []);

    // data.length
    //   ? sendRes(res, 200, 'success', 'get messages successfully', data)
    //   : sendRes(res, 404, 'fail', 'do not found any message');
  }

  @httpPost('/')
  async deliveryMessage(@reqBody() body: any, @response() res: Response) {
    const { _id } = await this.msgService.save(body);
    this.friendService.updateById(body.friend, { lastedMsg: _id });

    sendRes(res, 200, 'success', 'submit a message successfully', { _id });
  }
}
