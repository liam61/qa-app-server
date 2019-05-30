import { provide } from '../ioc/ioc';
import Question, { IQuestion } from '../models/question';
// import { ITodo, IPost } from './../models/user';
import TYPES from '../constant/types';
import BaseService from './base';
import { getLocalDate } from '../utils';

const getSection = (date: Date) =>
  date.toLocaleString('zh', { year: 'numeric', month: '2-digit' });

@provide(TYPES.QuestionService)
export default class QuestionService extends BaseService<
  typeof Question,
  IQuestion
> {
  constructor() {
    super(Question);
  }

  // async getQuestions<I extends IPost | ITodo>(qstIds){}
  async getQuestions(questions: any[], fromSelf: boolean): Promise<any> {
    const { data, newer } = await this.getQstsByIds(questions, fromSelf);

    const lists = await this.genListsWithSection(
      data,
      questions.map(q => q.status),
    );

    return { lists, total: data.length, newer };
  }

  async getQstsByIds(qsts: any[], fromSelf: boolean) {
    let newer = 0;

    // Primise<any> array
    const data: any[] = qsts.map(async qst => {
      const { questionId, status } = qst;

      if (
        (status === 'unfilled' && !fromSelf) ||
        (status === 'completed' && fromSelf)
      ) {
        newer += 1;
      }

      return await Question.findById(questionId)
        .sort('-createdAt')
        .populate('user', 'name avatar')
        .exec();
    });

    return { data, newer };
  }

  async genListsWithSection(data: any[], status: string[]) {
    let section = '';
    let count = 0;

    return data.reduce(
      async (
        arrPromise: Promise<any[]>,
        qstPromise: Promise<any>,
        i: number,
      ) => {
        const arr = await arrPromise;
        // qst.status = todos[i].status; // 不能赋值上去
        const qstPre = (await qstPromise).toObject();

        const qst = Object.assign(qstPre, {
          status: status[i],
          date: getLocalDate(qstPre.createdAt).slice(5, 12),
        });

        if (i === 0) {
          section = getSection(qst.createdAt);

          arr.push({ data: [qst], section });

          return arr;
        }

        const secCur = getSection(qst.createdAt);

        if (secCur === section) {
          arr[count].data.push(qst);
        } else {
          section = secCur;
          arr.push({ data: [qst], section });
          count += 1;
        }

        return arr;
      },
      [],
    );
  }

  async findDetailsById(id: string) {
    return await Question.find(id)
      .populate('QstDetail')
      .exec();
  }
}
