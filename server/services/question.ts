import { provide } from 'ioc/ioc';
import Question, { IQuestion } from 'models/question';
// import { ITodo, IPost } from 'models/user';
import TYPES from 'constant/types';
import BaseService from './base';
import { getLocalDate } from 'utils';

const getSection = (date: Date) => date.toLocaleString('zh', { year: 'numeric', month: '2-digit' });

@provide(TYPES.QuestionService)
export default class QuestionService extends BaseService<typeof Question, IQuestion> {
  constructor() {
    super(Question);
  }

  // async getQuestions<I extends IPost | ITodo>(qstIds){}
  genListsWithSection(todosOrPosts: any[], fromSelf: boolean) {
    let section = '';
    let index = 0;
    let newer = 0;

    const lists = todosOrPosts.reduce((arr, todoOrPost, i) => {
      // qst.status = todos[i].status; // 不能赋值上去
      const { question, status } = todoOrPost;

      if ((status === 'unfilled' && !fromSelf) || (status === 'completed' && fromSelf)) {
        newer += 1;
      }

      const qst = Object.assign(question.toObject(), { status, date: getLocalDate(question.createdAt).slice(5, 12) });

      if (i === 0) {
        section = getSection(qst.createdAt);

        arr.push({ data: [qst], section });

        return arr;
      }

      const secCur = getSection(qst.createdAt);

      if (secCur === section) {
        arr[index].data.push(qst);
      } else {
        section = secCur;
        arr.push({ data: [qst], section });
        index += 1;
      }

      return arr;
    }, []);

    return { lists, total: todosOrPosts.length, newer };
  }
}
