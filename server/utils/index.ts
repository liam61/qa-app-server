import path from 'path';
import { PREFIX } from 'common';
import { Types } from 'mongoose';
import uid from 'uid';
import { sendRes, sendErr } from './response';
import Uploader from './uploader';

const cwd = process.cwd();

function resolve(...filePath: string[]) {
  return path.join(cwd, ...filePath);
}

// tslint:disable-next-line: no-empty
function emptyFn() {}

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

function getSortedIds(user1: string, user2: string) {
  if (user1 < user2) {
    const temp = user1;
    user1 = user2;
    user2 = temp;
  }

  return { user1, user2 };
  // return user1 < user2 ? { user1: user2 } : { user1: user2, user2: user1 };
}

export { resolve, emptyFn, getUid, getObjectId, getLocalDate, sendRes, sendErr, Uploader, getSortedIds };
