import { BaseResponse } from "@/types/http/base";
import { Conversation } from "@/types/models/conversation";

export interface ConversationParams {
  id: string;
}

export interface GetConversationsResponse extends BaseResponse {
  conversations?: Conversation[];
}

export interface GetConversationResponse extends BaseResponse {
  conversation?: Conversation;
}

export interface MarkMessagesAsReadedResponse extends BaseResponse {
  conversation?: Conversation;
}
