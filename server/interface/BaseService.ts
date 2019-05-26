import { Document, Types } from 'mongoose';

export type idType = string | number | symbol | Types.ObjectId;

export default interface IBaseService<T> {
  findAll(conditions?: any, projection?: any, sort?: any): Promise<Document[]>;

  findById(id: idType, projection?: any, sort?: any): Promise<Document | null>;

  findOne(
    conditions: any,
    projection?: any,
    sort?: any
  ): Promise<Document | null>;

  save(params: T): Promise<Document>;

  update(id: idType, params: any): Promise<Document | null>;

  deleteById(id: idType): Promise<Document | null>;
}
