import { provide } from '../ioc/ioc';
// import { IIndex } from '../interface/IIndex';
import User, { IUser } from '../models/user';
import bcrypt from 'bcrypt';
import TYPES from '../constant/types';

@provide(TYPES.UserService)
export class UserService {
  public async getUsers() {
    return await User.find({}, '-password').exec();
  }

  public async getUserById(id: string) {
    return await User.findById(id, '-_id -password').exec();
  }

  public async createUser(name: string, password: string) {
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

  public async updateUser(id: string, params: IUser) {
    const { password } = params;

    if (password) {
      params.password = await bcrypt.hash(password, 10);
    }

    await User.findByIdAndUpdate(id, params).exec();
  }

  public async deleteUser(id: string) {
    await User.findByIdAndDelete(id).exec(); // findByIdAndRemove findOneAndDelete
  }
}
