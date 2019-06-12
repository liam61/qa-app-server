import { Schema, model, Types } from 'mongoose';
import { USER_REG, EMAIL_REG, PHONE_REG } from 'common';

export interface IUser {
  department?: string;
  name?: string;
  password?: string;
  email?: string;
  phone?: string;
  profile?: string;
  avatar?: string;
  cover?: string;
  birthday?: string;
  gender?: string;
  answer?: number;
  ask?: number;
  score?: number;
  todos?: ITodo[];
  posts?: IPost[];
}

export type qstStatusType = 'unread' | 'unfilled' | 'completed' | 'expired';

export interface ITodo {
  _id: string;
  question: string;
  status: qstStatusType;
  score: number;
}

// TODO: 完善 result
export interface IPost {
  _id: string;
  question: string;
  status: qstStatusType;
  result: any;
}

const todoSchema = new Schema({
  question: { type: Types.ObjectId, ref: 'Question' },
  status: String,
  score: Number,
});

const postSchema = new Schema({
  question: { type: Types.ObjectId, ref: 'Question' },
  status: String,
  result: String,
});

const userSchema = new Schema(
  {
    department: { type: Types.ObjectId, ref: 'Department', required: true }, // 关联
    name: {
      type: String,
      required: true,
      match: USER_REG,
      unique: true,
    },
    password: { type: String, required: true },
    email: { type: String, match: EMAIL_REG },
    phone: { type: String, match: PHONE_REG },
    profile: String,
    avatar: String,
    cover: String,
    birthday: String,
    gender: String,
    answer: Number,
    ask: Number,
    score: Number,
    todos: [todoSchema],
    posts: [postSchema],
  },
  { timestamps: true }
);

export default model('User', userSchema);
