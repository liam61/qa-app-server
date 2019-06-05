import { Schema, model, Types } from 'mongoose';

export interface IMessage {
  // id: string;
  from?: string;
  to: string;
  content: string;
  type?: 'text' | 'emoji' | 'file';
}

const MessageSchema = new Schema(
  {
    friend: { type: Types.ObjectId, ref: 'Friend', required: true },
    from: String,
    to: String,
    content: String,
    type: { type: String, default: 'text' },
  },
  { timestamps: true }
);

export default model('Message', MessageSchema);
