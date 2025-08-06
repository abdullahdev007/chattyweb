import { BaseResponse } from "../base";
import { IConversation } from "../../models/conversation";

export interface ConversationParams {
  id: string;
}

export interface GetConversationsResponse extends BaseResponse {
  conversations?: IConversation[];
}

export interface GetConversationResponse extends BaseResponse {
  conversation?: IConversation;
}

export interface MarkMessagesAsReadedResponse extends BaseResponse {
  conversation?: IConversation;
}
