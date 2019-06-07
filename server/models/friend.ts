import { Schema, model, Types } from 'mongoose';

export interface IFriend {
  user1: string;
  user2: string;
  applicant: string;
  receiver: string;
  success: boolean;
  // status: 'sent' | 'fulfill' | 'reject';
}

const FriendSchema = new Schema(
  {
    user1: { type: Types.ObjectId, ref: 'User', required: true }, // user1Id < user2Id
    user2: { type: Types.ObjectId, ref: 'User', required: true },
    lastMessage: { type: Types.ObjectId, ref: 'Message' },
    applicant: String, // 申请人
    receiver: String, // 接受人
    success: Boolean, // 添加成功
  },
  { timestamps: true },
);

export default model('Friend', FriendSchema);
