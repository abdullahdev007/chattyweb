import { Conversation } from "@/types/models/conversation";
import { Message } from "@/types/models/message";

export type SendMessagePayload = {
  conversation: Conversation;
  newMessage: Message;
};
