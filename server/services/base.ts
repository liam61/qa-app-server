import { provide, unmanaged } from '../ioc/ioc';
import TYPES from '../constant/types';
import { Model, Document } from 'mongoose';
import IBaseService, { idType } from '../interface/BaseService';

/**
 * 通用的 service 抽象类
 *
 * @class BaseService
 * @implements {IBaseService<I>}
 * @template M Model 如 model('User', userSchema);
 * @template I Interface 如 IUser
 */
@provide(TYPES.BaseService)
export default abstract class BaseService<M extends Model<Document>, I>
  implements IBaseService<I> {
  constructor(@unmanaged() protected _Model: M) {}

  async findAll(
    conditions?: any,
    projection?: any,
    sort?: any,
  ): Promise<Document[]> {
    return await this._Model
      .find(conditions, projection)
      .sort(sort)
      .exec();
  }

  async findById(
    id: idType,
    projection?: any,
    sort?: any,
  ): Promise<Document | null> {
    return await this._Model
      .findById(id, projection)
      .sort(sort)
      .exec();
  }

  async findOne(
    conditions: any,
    projection?: any,
    sort?: any,
  ): Promise<Document | null> {
    return await this._Model
      .findOne(conditions, projection)
      .sort(sort)
      .exec();
  }

  async save(params: I): Promise<Document> {
    return await new this._Model(params).save();
  }

  async update(id: idType, params: any): Promise<Document | null> {
    return await this._Model.findByIdAndUpdate(id, params).exec();
  }

  async deleteById(id: idType): Promise<Document | null> {
    return await this._Model.findByIdAndDelete(id).exec();
  }
}
