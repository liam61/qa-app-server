import { Schema, model } from 'mongoose';
import { USER_REG, EMAIL_REG, PHONE_REG } from '../common/global';

export interface IUser {
  name: string;
  password: string;
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
}

const userSchema = new Schema(
  {
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
  },
  { timestamps: true },
);

export default model('User', userSchema);
