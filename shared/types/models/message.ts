import type { ObjectId } from "mongoose";

export interface IMessage {
  _id: ObjectId;
  senderId: ObjectId;
  receiverId: ObjectId;
  replayTo: ObjectId | null;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}
