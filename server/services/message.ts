import { provide } from '../ioc/ioc';
import Message, { IMessage } from '../models/message';
import TYPES from '../constant/types';
import BaseService from './base';

@provide(TYPES.MessageService)
export default class MessageService extends BaseService<typeof Message, IMessage> {
  constructor() {
    super(Message);
  }
}
