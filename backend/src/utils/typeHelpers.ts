import { Document } from "mongoose";
import { Conversation as ConversationType } from "@shared/types/models/conversation.js";
import { Message as MessageType } from "@shared/types/models/message.js";

/**
 * Type helper to cast populated Mongoose documents to their expected populated types
 */
export function asPopulatedConversation<T extends Document>(
  doc: T,
): ConversationType {
  return doc as unknown as ConversationType;
}

export function asPopulatedMessage<T extends Document>(doc: T): MessageType {
  return doc as unknown as MessageType;
}

export function asPopulatedMessages<T>(docs: T[]): MessageType[] {
  return docs as unknown as MessageType[];
}
