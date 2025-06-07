import { Document, Schema, model } from 'mongoose';

// Interface
export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  profilePic?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Schema
const userSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    profilePic: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

export const userModel = model<IUser>('User', userSchema);
