import { Conversation } from "../models/conversation";
import { Message } from "../models/message";

export type SendMessagePayload = {
  conversation: Conversation;
  newMessage: Message;
};
