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
import { inject, TYPES, Response } from 'ioc/ioc';
import { sendRes } from 'utils';
import { VERSION } from 'common';
import { authMiddleware } from 'middleware';
import { FriendService, MessageService } from 'services';

@controller(`/${VERSION}/messages`, authMiddleware)
export default class MessageController {
  constructor(
    @inject(TYPES.FriendService) private friendService: FriendService,
    @inject(TYPES.MessageService) private msgService: MessageService
  ) {
    // FriendService
  }

  @httpGet('/') // 不能使用 params 参数，因为这里的 id 应该指的是 message model id 而不是 user id
  async getMessages(@queryParam('friendId') friendId: string, @response() res: Response) {
    // const { id: user1 } = req.user;
    // const { _id }: any = await this.friendService.findOne(getSortedIds(user1, user2), { success: true });
    const data = await this.msgService.findAll({ friend: friendId });

    sendRes(res, 200, 'success', 'get messages successfully', data || []);

    // data.length
    //   ? sendRes(res, 200, 'success', 'get messages successfully', data)
    //   : sendRes(res, 404, 'fail', 'do not found any message');
  }

  // NOTE: deprecated。已在 ws 处理
  @httpPost('/')
  async deliveryMessage(@reqBody() body: any, @response() res: Response) {
    const { _id } = await this.msgService.save(body);
    this.friendService.updateById(body.friend, { lastMessage: _id });

    sendRes(res, 200, 'success', 'submit a message successfully', { _id });
  }
}
