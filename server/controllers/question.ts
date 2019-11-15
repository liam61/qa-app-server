import {
  controller,
  response,
  request,
  requestParam as reqParam,
  requestBody as reqBody,
  queryParam,
  httpGet,
  httpPost,
  httpPut,
  httpDelete,
  httpPatch,
} from 'inversify-express-utils';
import { inject, TYPES, Response } from 'ioc/ioc';
import { QuestionService, QstDetailService, UserService } from 'services';
import { IQuestion } from 'models/question';
import { sendRes } from 'utils';
import { VERSION } from 'common';
import { authMiddleware } from 'middleware';
import { ITodo } from 'models/user';
import { Types } from 'mongoose';

@controller(`/${VERSION}/questions`, authMiddleware)
export default class QuestionController {
  constructor(
    @inject(TYPES.QuestionService) private qstService: QuestionService,
    @inject(TYPES.QstDetailService) private qDetailService: QstDetailService,
    @inject(TYPES.UserService) private userService: UserService
  ) {}

  // 获取被指定的问题
  @httpGet('/')
  async getTodos(@request() req: any, @response() res: Response) {
    const { id } = req.user;

    const { todos }: any = await this.userService.findById(id, 'todos', null, {
      path: 'todos.question',
      populate: { path: 'user', select: 'name avatar' },
    });

    const data = this.qstService.genListsWithSection(todos, false);

    data.total
      ? sendRes(res, 200, 'success', 'get todos successfully', data)
      : sendRes(res, 404, 'fail', 'no todo exists', { lists: [], total: 0, newer: 0 });
  }

  // 获取自己创建的问题
  @httpGet('/:id')
  async getPosts(@request() req: any, @reqParam('id') userId: string, @response() res: Response) {
    const { id } = req.user;

    if (id !== userId) {
      sendRes(res, 400, 'fail', 'not current user');

      return;
    }

    // 获取该用户创建的问题
    const { posts }: any = await this.userService.findById(id, 'posts', null, {
      path: 'posts.question',
      populate: { path: 'user', select: 'name avatar' },
    });

    const data = this.qstService.genListsWithSection(posts, true);

    data.total
      ? sendRes(res, 200, 'success', 'get posts successfully', data)
      : sendRes(res, 400, 'fail', 'no post exists', { lists: [], total: 0, newer: 0 });
  }

  @httpGet('/:id/details')
  async getQstDetailById(
    @request() req: any,
    @reqParam('id') qstId: string,
    @queryParam('poster') poster: string,
    @response() res: Response
  ) {
    const { id: userId } = req.user;
    const data: any = await this.qDetailService.findOne({ question: qstId }, null, null, {
      path: 'qstItems.replies.user',
      select: 'name avatar',
    });

    const qstItems = data.qstItems.toObject();

    // 转换为 boolean，更新 poster 的 post 状态
    if (JSON.parse(poster)) {
      // 所有人填写完，作者还未查看结果
      await this.userService.updatePostStatus(userId, qstId, 'unread', 'completed');
    } else {
      // 更新 receiver 的 todo 状态
      await this.userService.updateTodoStatus(userId, qstId, 'unread', 'unfilled');

      // 更新 poster 的状态
      const statusArr = await this.getStatusByQstId(qstId);
      // 都阅读完
      if (!statusArr.some(s => s === 'unread')) {
        const { user: posterId }: any = await this.qstService.findById(qstId, 'user');

        await this.userService.updatePostStatus(posterId, qstId, 'post', 'unfilled');
      }

      // 过滤别人的回答
      qstItems.forEach(
        (qstItem: any) => (qstItem.replies = qstItem.replies.filter((r: any) => r.user._id.toString() === userId))
      );
    }

    data
      ? sendRes(res, 200, 'success', 'get a question detail successfully', Object.assign(data.toObject(), { qstItems }))
      : sendRes(res, 400, 'fail', 'question do not exist');
  }

  @httpPost('/')
  async createQuestion(@request() req: any, @reqBody() body: any, @response() res: Response) {
    const { id } = req.user; // poster id
    const { qstItems, receivers: rsToSave, ...restBody } = body;

    const { _id } = await this.qstService.save({ user: id, ...restBody });
    await this.qDetailService.save({
      question: _id,
      qstItems,
      receivers: rsToSave.map((r: string) => ({ user: Types.ObjectId(r) })),
    });

    // 更新 poster 的 posts
    const { posts }: any = await this.userService.findById(id, 'posts');
    posts.push({ question: _id, status: 'post' });

    await this.userService.updateById(id, { posts });

    // 更新 receivers 的 todos
    const { receivers } = body;

    receivers.forEach(async (userId: string) => {
      const { todos }: any = await this.userService.findById(userId, 'todos');
      todos.push({ question: _id, status: 'unread', score: 0 });

      await this.userService.updateById(userId, { todos });
    });

    sendRes(res, 201, 'success', 'create a question successfully');
  }

  @httpPut('/:id')
  async updateQuestion(@reqParam('id') id: string, @reqBody() body: IQuestion, @response() res: Response) {
    await this.qstService.updateById(id, body);

    sendRes(res, 200, 'success', 'update question successfully');
  }

  @httpPatch('/:id/details')
  async submitReplies(
    @request() req: any,
    @reqParam('id') detailId: string, // detailId
    @reqBody() body: any[],
    @response() res: Response
  ) {
    const { id: userId } = req.user;

    const { question: qstId }: any = await this.qDetailService.findById(detailId, 'question');

    await this.qDetailService.reply(detailId, userId, body);

    // 更新 receiver 的 todo 状态
    await this.userService.updateTodoStatus(userId, qstId, 'unfilled', 'completed');

    // 更新 poster 的 post 状态
    const statusArr = await this.getStatusByQstId(qstId);
    // 都完成了
    if (statusArr.every(s => s === 'completed')) {
      const { user: posterId }: any = await this.qstService.findById(qstId, 'user');

      await this.userService.updatePostStatus(posterId, qstId, 'unfilled', 'unread');
    }

    sendRes(res, 200, 'success', 'submit question successfully');
  }

  @httpDelete('/:id')
  async deleteQuestion(@reqParam('id') id: string, @response() res: Response) {
    await this.qstService.deleteById(id);

    sendRes(res, 200, 'success', 'delete a question successfully');
  }

  async getStatusByQstId(qstId: string): Promise<string[]> {
    const { receivers }: any = await this.qDetailService.findOne({ question: qstId }, 'receivers', null, {
      path: 'receivers.user',
      select: 'todos',
    });

    return receivers.map(
      ({ user }: any) => {
        const todo = user.todos.find((t: ITodo) => t.question.toString() === qstId.toString()) || {};
        return todo.status;
      }
    );
  }
}
