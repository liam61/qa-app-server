import { provide } from '../ioc/ioc';
import QstDetail, { IQstDetail } from '../models/qstDetail';
import TYPES from '../constant/types';
import BaseService from './base';

@provide(TYPES.QstDetailService)
export default class QstDetailService extends BaseService<
  typeof QstDetail,
  IQstDetail
> {
  constructor() {
    super(QstDetail);
  }

  // 不能让用户获取到其他用户提交的问题答案，所以 replies 不能覆盖上传，只能通过 id 判断
  async reply(detailId: string, replies: any[], userId: string) {
    const data: any = await super.findOne({ _id: detailId }, 'qstItems');
    const qstItems = data.qstItems.toObject();

    replies.forEach((reply: any) => {
      const { id, replies: r } = reply;

      qstItems.forEach((qstItem: any) => {
        if (qstItem._id.toString() === id) {
          qstItem.replies.set(userId, r);
        }
      });
    });

    return await super.update(detailId, { qstItems });
  }
}
