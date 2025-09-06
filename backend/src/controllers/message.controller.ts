import { Request, RequestHandler, Response } from "express";
import {
  ConversationParams,
  GetMessagesResponse,
  SendMessageRequestBody,
  SendMessageResponse,
} from "@shared/types/http/index.js";
import {
  sendMessage as sendMessageService,
  getMessages as getMessagesService,
} from "@/services";

export const sendMessage = async (
  req: Request<ConversationParams, SendMessageResponse, SendMessageRequestBody>,
  res: Response<SendMessageResponse>,
) => {
  try {
    const { message, replayTo } = req.body;
    const { id: conversationId } = req.params;
    const senderId = req.user?._id.toString();

    const result = await sendMessageService(
      conversationId,
      senderId,
      message,
      replayTo,
    );

    res.status(200).json({
      success: true,
      conversation: result.conversation,
      newMessage: result.newMessage,
    });
  } catch (error: any) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const getMessages = async (
  req: Request<ConversationParams, GetMessagesResponse>,
  res: Response<GetMessagesResponse>,
) => {
  try {
    const { id: conversationId } = req.params;
    const userId = req.user?._id.toString();

    const messages = await getMessagesService(conversationId, userId);

    res.status(200).json({ success: true, messages });
  } catch (error: any) {
    console.log("error in getMessages controller :", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
