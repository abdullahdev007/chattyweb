import { BaseResponse } from "../base";
import { Conversation } from "../../models/conversation";

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
