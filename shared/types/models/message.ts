import type { ObjectId } from "mongoose";
import { SafeUser } from "./user";

export interface IMessage<
  TSenderId = ObjectId,
  TReceiverId = ObjectId,
  TReplayTo = ObjectId | null,
> {
  _id: ObjectId;
  senderId: TSenderId;
  receiverId: TReceiverId;
  replayTo: TReplayTo;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

// Fully populated message type
export type Message = IMessage<
  SafeUser,
  SafeUser,
  IMessage<SafeUser, SafeUser, ObjectId | null> | null
>;
