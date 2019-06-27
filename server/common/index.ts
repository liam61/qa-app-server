const isDev = process.env.NODE_ENV === 'development';

const PREFIX = 'qa';
const HOST = isDev ? 'localhost' : 'omyleon.com';
const PORT = 6260;
const CLIENT_URL = isDev ? `http://${HOST}:3000` : `https://${PREFIX}.${HOST}`;
const VERSION = 'v1';
const DB_NAME = `${PREFIX}-app`;
const CONN_STR = `mongodb://${HOST}:27017/${DB_NAME}`;
// const CONN_STR = `mongodb://user:pass@${HOST}:27017/${DB_NAME}`;
const STATIC_PATH = `${VERSION}/uploads`;
const BASE_URL = isDev ? `http://${HOST}:${PORT}` : `https://qaapi.omyleon.com`; // nginx
const JWT_KEY = '9AjeX6xQ46Hn';

const USER_REG = /^(?=.{6,12}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;
const EMAIL_REG = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
const PHONE_REG = /^(?:\+?86)?1(?:3\d{3}|5[^4\D]\d{2}|8\d{3}|7(?:[35678]\d{2}|4(?:0\d|1[0-2]|9\d))|9[189]\d{2}|66\d{2})\d{6}$/;
const PASSWORD_REG = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

const QST_STATUS = [
  { key: 'post', value: '刚发布' },
  { key: 'unread', value: '未读' }, // 不是所有人都阅读过
  { key: 'unfilled', value: '未填写' }, // 不是所有人有填写了
  { key: 'completed', value: '已完成' }, // 所有人都填写了，已出报告
  { key: 'expired', value: '已过期' },
];
// 被指定者问题状态：unread -> unfilled -> completed | expired
// 作者问题状态：post -> unfilled -> unread -> completed

const ROOT_USER = 'lawler';

export {
  HOST,
  DB_NAME,
  CONN_STR,
  VERSION,
  PREFIX,
  PORT,
  BASE_URL,
  STATIC_PATH,
  JWT_KEY,
  USER_REG,
  EMAIL_REG,
  PHONE_REG,
  PASSWORD_REG,
  QST_STATUS,
  ROOT_USER,
  CLIENT_URL,
};
