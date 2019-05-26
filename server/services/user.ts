import { provide } from '../ioc/ioc';
import BaseService from './base';
import User, { IUser } from '../models/user';
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
    // const { length } = await User.find({ name }).exec();
    // if (length >= 1) {
    //   return {
    //     status: 409,
    //     statusText: 'username exists',
    //     data: { type: 'fail' },
    //   };
    // }
    // if (!PASSWORD_REG.test(password)) {
    //   return {
    //     status: 409,
    //     statusText: 'password is illegal',
    //     data: { type: 'fail' },
    //   };
    // }
    const hash = await bcrypt.hash(password, 10); // error handled by setErrorConfig
    await new User({ name, password: hash }).save(); // error handled by setErrorConfig
  }

  async login(account: string, password: string) {
    const type = this.getAccountType(account);

    const user: any = await User.findOne(
      { [type]: account },
      'name password'
    ).exec();

    return {
      match: await bcrypt.compare(password, user.password),
      user,
    };
  }

  async update(id: string, params: IUser) {
    const { password } = params;

    if (password) {
      params.password = await bcrypt.hash(password, 10);
    }

    return super.update(id, params);
  }

  /**
   * 验证用户
   *
   * @param {string} account name/email/phone
   * @returns {boolean} exist true：注册过；false：未注册过
   */
  async validateAccount(account: string) {
    const type = this.getAccountType(account);

    const { length } = await User.find({ [type]: account }).exec();

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
