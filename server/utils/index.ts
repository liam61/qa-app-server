import path from 'path';
import { PREFIX } from '../common/global';
import { Types } from 'mongoose';
import uid from 'uid';
import { sendRes, sendErr } from './response';
import Uploader from './uploader';

const cwd = process.cwd();

function resolve(...filePath: string[]) {
  return path.join(cwd, ...filePath);
}

function getUid(len = 10) {
  return `${PREFIX}-${uid(len)}`;
}

function getObjectId() {
  return Types.ObjectId();
}

function getLocalDate(date: Date) {
  // return date.toLocaleString('zh', { hour12: false }).replace(/\//g, '-');
  return date.toLocaleString().replace(/\//g, '-');
}

export {
  resolve,
  getUid,
  getObjectId,
  getLocalDate,
  sendRes,
  sendErr,
  Uploader,
};
