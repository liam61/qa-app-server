import { provide } from 'ioc/ioc';
import Friend, { IFriend } from 'models/friend';
import TYPES from 'constant/types';
import BaseService from './base';

@provide(TYPES.FriendService)
export default class FriendService extends BaseService<typeof Friend, IFriend> {
  constructor() {
    super(Friend);
  }

  async getFriends(conditions: any, projection: any) {
    return await Friend.find(conditions, projection)
      .populate([{ path: 'user1', select: '-password' }, { path: 'user2', select: '-password' }, 'lastMessage'])
      .exec();
  }

  async getApplies(conditions: any) {
    return await Friend.find(conditions)
      .populate([{ path: 'user1', select: '-password' }, { path: 'user2', select: '-password' }])
      .exec();
  }
}
