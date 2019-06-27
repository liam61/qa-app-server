import { Schema, model, Types } from 'mongoose';

export interface IQstItem {
  num: number;
  type: string;
  title: string;
  options?: IOption[];
  required: boolean;
  replies: Array<{ user: string; value: string[] }>;
}

export interface IOption {
  _id: string;
  value: string;
}

export interface IQstDetail {
  question: string;
  qstItems: IQstItem[];
  receivers: Array<{ user: string }>;
}

const QstItem = new Schema({
  num: Number,
  type: String,
  title: String,
  options: [{ value: String }],
  required: Boolean,
  // replies: { type: Map, of: [String], default: {} },
  replies: [{ user: { type: Types.ObjectId, ref: 'User', required: true }, value: [String] }],
});

const QstDetailSchema = new Schema(
  {
    question: { type: Types.ObjectId, ref: 'Question', required: true },
    qstItems: [QstItem],
    receivers: [{ user: { type: Types.ObjectId, ref: 'User' } }],
  },
  { timestamps: true }
);

export default model('QstDetail', QstDetailSchema);
