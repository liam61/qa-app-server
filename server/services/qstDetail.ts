import { provide } from '../ioc/ioc';
import QstDetail, { IQstDetail } from '../models/qstDetail';
import TYPES from '../constant/types';
import BaseService from './base';

@provide(TYPES.QstDetailService)
export default class QstDetailService extends BaseService<typeof QstDetail, IQstDetail> {
  constructor() {
    super(QstDetail);
  }

  // 不能让用户获取到其他用户提交的问题答案，所以 replies 不能覆盖上传，只能通过 id 遍历判断
  async reply(id: string, userId: string, replies: any[]) {
    const { qstItems }: any = await this.findOne({ _id: id }, 'qstItems');

    qstItems.forEach((qstItem: any) => {
      replies.forEach((reply: any) => {
        if (reply.pushed) {
          return;
        }

        const { id: itemId, replies: r } = reply;

        if (qstItem._id.toString() === itemId) {
          // qstItem.replies.set(userId, r);
          qstItem.replies.push({ userId, value: r });

          reply.pushed = true;
        }
      });
    });

    return await this.updateById(id, { qstItems });
  }
}
