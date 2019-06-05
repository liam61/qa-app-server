import { Schema, model, Types } from 'mongoose';

export interface IQuestion {
  user: string;
  title?: string;
  content?: string;
  files?: IFile[];
  secret?: boolean;
  anonymous?: boolean;
  showAuthor?: boolean;
  expire?: string;
  type?: string;
  read?: number;
  unread?: number;
}

interface IFile {
  // id: string;
  url: string;
  name?: string;
  size?: string;
  cover?: boolean;
}

// type receiversType = { [key in 'department' | 'account']?: string[] };

const fileSchema = new Schema({
  url: String,
  name: String,
  size: String,
  cover: Boolean,
});

const questionSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: 'User', required: true }, // 关联
    title: String,
    content: String,
    files: [fileSchema],
    secret: Boolean,
    anonymous: Boolean,
    showAuthor: Boolean,
    expire: String,
    type: String,
    read: Number,
    unread: Number,
  },
  { timestamps: true }
);

export default model('Question', questionSchema);
