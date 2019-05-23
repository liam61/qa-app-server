import { Schema, model } from 'mongoose';

const USER_REG = /^(?=.{6,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;
const EMAIL_REG = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
const PHONE_REG = /^(?:\+?86)?1(?:3\d{3}|5[^4\D]\d{2}|8\d{3}|7(?:[35678]\d{2}|4(?:0\d|1[0-2]|9\d))|9[189]\d{2}|66\d{2})\d{6}$/;
// const PASSWORD_REG = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

export interface IUser {
  name: string;
  password: string;
  email: string;
  phone: string;
  profile: string;
  avatar: string;
  cover: string;
  birthday: string;
  gender: string;
  answer: number;
  ask: number;
  score: number;
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
  { timestamps: true }
);

export default model('User', userSchema);
