import { provide } from 'ioc/ioc';
import BaseService from './base';
import User, { IUser, ITodo, IPost, qstStatusType } from 'models/user';
import bcrypt from 'bcrypt';
import TYPES from 'constant/types';

@provide(TYPES.UserService)
export default class UserService extends BaseService<typeof User, IUser> {
  constructor() {
    super(User);
  }

  async createUser(params: IUser) {
    const { password } = params;

    if (password) {
      params.password = await bcrypt.hash(password, 10);
    }

    return await this.save(params);
  }

  async login(account: string, password: string) {
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

    return await super.updateById(id, params);
  }

  async updateTodoStatus(id: string, questionId: string, from: qstStatusType, to: qstStatusType) {
    const { todos }: any = await this.findById(id, 'todos');

    todos.forEach((todo: ITodo) => {
      const { question: qstId, status } = todo;

      if (qstId.toString() === questionId.toString() && (status === from || to === 'expired')) {
        todo.status = to;
      }
    });

    return await this.updateById(id, { todos });
  }

  async updatePostStatus(id: string, questionId: string, from: qstStatusType, to: qstStatusType) {
    const { posts }: any = await this.findById(id, 'posts');

    posts.forEach((post: IPost) => {
      const { question: qstId, status } = post;

      if (qstId.toString() === questionId.toString() && (status === from || to === 'expired')) {
        post.status = to;
      }
    });

    return await super.updateById(id, { posts });
  }

  async getAllQstsById(id: string, type: string) {
    return await User.findById(id, type).populate({
      path: `${type}.question`,
      populate: { path: 'user', select: 'name avatar' },
    });
  }

  /**
   * 验证用户
   *
   * @param {string} account name/email/phone
   * @returns {boolean} exist true：注册过；false：未注册过
   */
  async validateAccount(account: string) {
    const { length } = await User.find(
      { $or: [{ email: account }, { phone: account }, { name: account }] },
      'name'
    ).exec();

    return length > 0;
  }
}
