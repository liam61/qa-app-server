import { Schema, model, Types } from 'mongoose';

export interface IDepartment {
  name: string;
  staff?: Array<{ user: string }>;
  description: string;
}

const departmentSchema = new Schema(
  {
    name: String,
    staff: [
      {
        user: { type: Types.ObjectId, ref: 'User' },
      },
    ],
    description: String,
  },
  { timestamps: true }
);

export default model('Department', departmentSchema);
