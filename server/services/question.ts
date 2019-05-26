import { provide } from '../ioc/ioc';
import Question, { IQuestion } from '../models/question';
import TYPES from '../constant/types';
import BaseService from './base';

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

  async findAll(conditions?: IQuestion): Promise<any> {
    // const data = await Question.find(conditions).sort('-createdAt').exec();
    const data = await super.findAll(conditions, null, '-createdAt');

    let section = '';
    let count = 0;

    const lists = data.reduce((arr: any, qst: any, i) => {
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
    }, []);

    return { lists, total: data.length };
  }

  async findDetailsById(id: string) {
    return await Question.find(id)
      .populate('QstDetail')
      .exec();
  }
}
