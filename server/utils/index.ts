import { sendRes, sendErr } from './response';
import uid from 'uid';
import { PREFIX } from '../common/global';
import { Types } from 'mongoose';

function getUid(len = 10) {
  return `${PREFIX}-${uid(len)}`;
}

function getObjectId() {
  return Types.ObjectId();
}

function getLocalDate(date: Date) {
  return date.toLocaleString('zh', { hour12: false }).replace(/\//g, '-');
}

export { getUid, getObjectId, getLocalDate, sendRes, sendErr };
