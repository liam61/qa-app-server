import { provide } from '../ioc/ioc';
import BaseService from './base';
import User, { IUser, ITodo, IPost, qstStatusType } from '../models/user';
import bcrypt from 'bcrypt';
import TYPES from '../constant/types';
import { EMAIL_REG, PHONE_REG } from '../common/global';

@provide(TYPES.UserService)
export default class UserService extends BaseService<typeof User, IUser> {
  constructor() {
    super(User);
  }

  async save(params: IUser) {
    const { password } = params;

    if (password) {
      params.password = await bcrypt.hash(password, 10);
    }

    return super.save(params);
  }

  async createUser(name: string, password: string) {
    const hash = await bcrypt.hash(password, 10); // error handled by setErrorConfig
    await new User({ name, password: hash }).save(); // error handled by setErrorConfig
  }

  async login(account: string, password: string) {
    // const type = this.getAccountType(account);
    // const user: any = await User.findOne({ [type]: account }, 'name password').exec();
    const user: any = await User.findOne(
      { $or: [{ email: account }, { phone: account }, { name: account }] },
      'name password'
    ).exec();

    return {
      matched: await bcrypt.compare(password, user.password),
      user,
    };
  }

  async updateById(id: string, params: IUser) {
    const { password } = params;

    if (password) {
      params.password = await bcrypt.hash(password, 10);
    }

    return super.updateById(id, params);
  }

  async updateTodoStatus(id: string, questionId: string, from: qstStatusType, to: qstStatusType) {
    const { todos }: any = await super.findById(id, 'todos');

    todos.forEach((todo: ITodo) => {
      const { questionId: qstId, status } = todo;

      if (qstId === questionId && (status === from || to === 'expired')) {
        todo.status = to;
      }
    });

    return await super.updateById(id, { todos });
  }

  async updatePostStatus(id: string, questionId: string, from: qstStatusType, to: qstStatusType) {
    const { posts }: any = await this.findById(id, 'posts');

    // TODO: 获取所有人 receiver 情况，来判断是否是所有人都阅读或填写
    posts.forEach((post: IPost) => {
      const { questionId: qstId, status } = post;

      if (qstId === questionId && (status === from || to === 'expired')) {
        post.status = to;
      }
    });

    return await super.updateById(id, { posts });
  }

  async isCompletePost(receivers: any, qstId: string) {
    const { account } = receivers;

    const statusArr: string[] = account.map(async (userId: string) => {
      const { todos }: any = await this.findById(userId, 'todos');

      return todos.find((t: ITodo) => t.questionId === qstId).status;
    });

    // return statusArr.every(s => s === 'completed') ? { change: true, status: 'completed' } : { change: false };
    return statusArr.every(s => s === 'completed');
  }

  /**
   * 验证用户
   *
   * @param {string} account name/email/phone
   * @returns {boolean} exist true：注册过；false：未注册过
   */
  async validateAccount(account: string) {
    // const type = this.getAccountType(account);
    // const { length } = await User.find({ [type]: account }, 'name').exec();
    const { length } = await User.find(
      { $or: [{ email: account }, { phone: account }, { name: account }] },
      'name'
    ).exec();

    return length > 0;
  }

  getAccountType = (account: string) => {
    let type = 'name';

    if (EMAIL_REG.test(account)) {
      type = 'email';
    } else if (PHONE_REG.test(account)) {
      type = 'phone';
    }

    return type;
  };
}
