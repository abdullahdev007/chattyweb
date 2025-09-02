import type { ObjectId } from "mongoose";
import { SafeUser } from "./user";
import { IMessage } from "./message";

export interface IParticipant<TUserId = ObjectId> {
  userId: TUserId;
  unreadCount: number;
}

export interface IConversation<
  TParticipants = IParticipant[],
  TMessages = ObjectId[],
> {
  _id: ObjectId;
  participants: TParticipants;
  messages: TMessages;
  createdAt: Date;
  updatedAt: Date;
}

// Fully populated conversation type
export type Conversation = IConversation<
  IParticipant<SafeUser>[],
  IMessage<SafeUser, ObjectId | null>[]
>;
