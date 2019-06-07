import { Schema, model } from 'mongoose';

export interface IDepartment {
  name: string;
  staff?: Array<{ userId: string }>;
  description: string;
}

const departmentSchema = new Schema(
  {
    name: String,
    staff: [{ userId: String }],
    description: String,
  },
  { timestamps: true }
);

export default model('Department', departmentSchema);
