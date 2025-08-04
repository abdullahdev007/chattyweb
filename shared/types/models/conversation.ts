import type { ObjectId } from "mongoose";

export interface IParticipant {
  userId: ObjectId;
  unreadCount: number;
}

export interface IConversation {
  _id: ObjectId;
  participants: IParticipant[];
  messages: ObjectId[];
  latestMessage: ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}
