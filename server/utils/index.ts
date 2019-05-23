import { Types } from 'mongoose';
import sendRes from './response';

function getUid() {
  return new Types.ObjectId();
}

export { getUid, sendRes };
