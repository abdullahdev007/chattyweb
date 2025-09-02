import type { ObjectId } from "mongoose";
import { SafeUser } from "@/types/models/user";

export interface INotification {
  _id: ObjectId | string;
  senderId: ObjectId;
  receiverId: ObjectId;
  type: string;
  readed: boolean;
  message: string;
  createdAt: Date;
}


export type SafeNotification = Omit<
  INotification,
  "senderId" | "receiverId"
> & {
  senderId: SafeUser;
  receiverId: SafeUser;
};