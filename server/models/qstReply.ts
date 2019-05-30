import { Schema, model, Types } from 'mongoose';

const QstReplySchema = new Schema(
  {
    qstDetail: { type: Types.ObjectId, ref: 'QstItem', required: true },
    replies: { type: Map, of: [String], default: {} },
  },
  { timestamps: true },
);

export default model('QstReply', QstReplySchema);
