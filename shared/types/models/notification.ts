import type { ObjectId } from "mongoose";

export interface INotification {
  senderId: ObjectId;
  receiverId: ObjectId;
  type: string;
  readed: boolean;
  message: string;
  createdAt: Date;
}
