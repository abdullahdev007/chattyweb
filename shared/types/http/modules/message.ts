import { Conversation } from "@shared/types/models/conversation";
import { BaseResponse } from "../base";
import { Message } from "@shared/types/models/message";

export interface SendMessageRequestBody {
  message: string;
  replayTo?: string;
}

export interface SendMessageResponse extends BaseResponse {
  conversation?: Conversation;
  newMessage?: Message;
}

export interface GetMessagesResponse extends BaseResponse {
  messages?: Message[];
}

export interface GetUnreadCountResponse extends BaseResponse {
  unreadCount?: number;
}

export interface IncreaseUnReadCountResponse extends BaseResponse {
  conversation?: Conversation;
}
