import { IConversation } from "@shared/types/models/conversation";
import { BaseResponse } from "../base";
import { IMessage } from "@shared/types/models/message";

export interface SendMessageRequestBody  {
  message: string
}

export interface SendMessageResponse extends BaseResponse {
  conversation?: IConversation,
  newMessage?: IMessage
}

export interface GetMessagesResponse extends BaseResponse {
  messages?: IMessage[],
}

export interface GetUnreadCountResponse extends BaseResponse {
  unreadCount?: number,
}

export interface IncreaseUnReadCountResponse extends BaseResponse {
  conversation?: IConversation;
}
