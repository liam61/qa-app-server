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
    // TODO: 过滤掉 user 密码
    return await Friend.find(conditions, projection).populate(['user1', 'user2', 'lastMessage']);
  }

  async getApplies(conditions: any) {
    return await Friend.find(conditions).populate(['user1', 'user2']);
  }
}
