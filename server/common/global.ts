// database
const HOST = 'localhost';
const DB_NAME = 'qa-app';
const CONN_STR = `mongodb://${HOST}:27017/${DB_NAME}`;
// const CONN_STR = `mongodb://user:pass@${HOST}:27017/${DB_NAME}`;
const VERSION = 'v1';

// server
const PREFIX = 'qa';
const PORT = 4000;
const JWT_KEY = '9AjeX6xQ46Hn';
const USER_REG = /^(?=.{6,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;
const EMAIL_REG = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
const PHONE_REG = /^(?:\+?86)?1(?:3\d{3}|5[^4\D]\d{2}|8\d{3}|7(?:[35678]\d{2}|4(?:0\d|1[0-2]|9\d))|9[189]\d{2}|66\d{2})\d{6}$/;
const PASSWORD_REG = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

export {
  HOST,
  DB_NAME,
  CONN_STR,
  VERSION,
  PREFIX,
  PORT,
  JWT_KEY,
  USER_REG,
  EMAIL_REG,
  PHONE_REG,
  PASSWORD_REG,
};
