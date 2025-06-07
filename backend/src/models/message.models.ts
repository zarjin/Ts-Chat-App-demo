import { Document, model, Schema, Types } from 'mongoose';

// Interface
export interface IMessage extends Document {
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  message: string;
  image?: string;
}

// Schema
const messageSchema = new Schema<IMessage>(
  {
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    image: { type: String },
  },
  {
    timestamps: true,
  }
);

// Model
export const messageModel = model<IMessage>('Message', messageSchema);
