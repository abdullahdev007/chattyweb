import { IConversation } from "../models/conversation"
import { IMessage } from "../models/message"

export type SendMessagePayload = {
  conversation: IConversation,
  newMessage: IMessage
}