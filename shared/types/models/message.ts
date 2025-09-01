import type { ObjectId } from "mongoose";
import { SafeUser } from "./user";

export interface IMessage<TSenderId = ObjectId, TReplayTo = ObjectId | null> {
  _id: ObjectId;
  senderId: TSenderId;
  replayTo: TReplayTo;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

// Fully populated message type
export type Message = IMessage<
  SafeUser,
  IMessage<SafeUser, ObjectId | null> | null
>;
