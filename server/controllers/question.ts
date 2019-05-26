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
  httpPatch,
} from 'inversify-express-utils';
import { inject, TYPES, Response } from '../ioc/ioc';
import { QuestionService, QstDetailService } from '../services';
import { IQuestion } from './../models/question';
import { sendRes } from '../utils';
import { VERSION } from '../common/global';
// import { authMiddleware } from '../middleware';

@controller(`/${VERSION}/questions`)
export default class QuestionController {
  constructor(
    @inject(TYPES.QuestionService) private qstService: QuestionService,
    @inject(TYPES.QstDetailService) private qDetailService: QstDetailService
  ) {}

  // TODO: authMiddleware
  @httpGet('/')
  async getQuestions(@request() req: any, @response() res: Response) {
    // const { id } = req.user;
    console.log(req);

    // const data = await this.qstService.findAll({ userId: id });
    const data = await this.qstService.findAll();

    data
      ? sendRes(res, 200, 'success', 'get questions successfully', data)
      : sendRes(res, 404, 'fail', 'no question exists');
  }

  @httpGet('/:id')
  async getQuestionById(@reqParam('id') id: string, @response() res: Response) {
    const data = await this.qstService.findById(id);

    data
      ? sendRes(res, 200, 'success', 'get a question successfully', data)
      : sendRes(res, 400, 'fail', 'question do not exist');
  }

  @httpGet('/:id/details')
  async getQstDetailById(
    @reqParam('id') id: string,
    @response() res: Response
  ) {
    const data = await this.qDetailService.findOne({ questionId: id });

    data
      ? sendRes(
          res,
          200,
          'success',
          'get a question detail successfully',
          data.toObject()
        )
      : sendRes(res, 400, 'fail', 'question do not exist');
  }

  @httpPost('/')
  async createQuestion(@reqBody() body: any, @response() res: Response) {
    const { _id } = await this.qstService.save(body);

    await this.qDetailService.save({ questionId: _id, ...body });

    sendRes(res, 201, 'success', 'create a question successfully');
  }

  @httpPut('/:id')
  async updateQuestion(
    @reqParam('id') id: string,
    @reqBody() body: IQuestion,
    @response() res: Response
  ) {
    await this.qstService.update(id, body);

    sendRes(res, 200, 'success', 'update question successfully');
  }

  @httpPatch('/:id/details')
  async submitQstDetail(
    @reqParam('id') id: string, // detailId
    @reqBody() body: any[],
    @response() res: Response
  ) {
    const userId = '5ce8053471841b824c75d09c'; // authMiddleware

    await this.qDetailService.reply(id, body, userId);

    sendRes(res, 200, 'success', 'submit question successfully');
  }

  @httpDelete('/:id')
  async deleteQuestion(@reqParam('id') id: string, @response() res: Response) {
    await this.qstService.deleteById(id);

    sendRes(res, 200, 'success', 'delete a question successfully');
  }
}
