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

    console.log(id);

    // 获取该用户被指定的问题
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
    @request() _req: any,
    @reqParam('id') id: string, // questionId
    @queryParam('poster') _poster: string,
    @response() res: Response
  ) {
    // const { id: userId } = req.user;
    // console.log('getQstDetailById');

    console.log(id);
    const data = await this.qDetailService.findOne({ question: id });

    console.log(data);

    // if (JSON.parse(poster)) { // 转换为 boolean
    //   // 更新 poster 的 post 状态
    //   await this.userService.updatePostStatus(userId, id, 'unread', 'unfilled');
    // } else {
    //   // 更新 receiver 的 todo 状态
    //   console.log('updateTodoStatus0');
    //   await this.userService.updateTodoStatus(userId, id, 'unread', 'unfilled');
    // }

    data
      ? sendRes(res, 200, 'success', 'get a question detail successfully', data.toObject())
      : sendRes(res, 400, 'fail', 'question do not exist');
  }

  @httpPost('/')
  async createQuestion(@request() req: any, @reqBody() body: any, @response() res: Response) {
    const { id } = req.user; // poster id
    const { _id } = await this.qstService.save({ user: id, ...body });

    await this.qDetailService.save({ question: _id, ...body });

    // 更新 poster 的 posts
    const { posts }: any = await this.userService.findById(id, 'posts');
    posts.push({ question: _id, status: 'unread', score: 0 });

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
    const { receivers }: any = await this.qDetailService.findOne({ question: qstId }, 'receivers');
    const completed = await this.userService.isCompletePost(receivers, qstId);

    if (completed) {
      const { user: posterId }: any = await this.qstService.findById(qstId, 'user');

      await this.userService.updatePostStatus(posterId, qstId, 'unfilled', 'completed');
    }

    sendRes(res, 200, 'success', 'submit question successfully');
  }

  @httpDelete('/:id')
  async deleteQuestion(@reqParam('id') id: string, @response() res: Response) {
    await this.qstService.deleteById(id);

    sendRes(res, 200, 'success', 'delete a question successfully');
  }
}
