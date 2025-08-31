import { Request, RequestHandler, Response } from "express";
import {
  ConversationParams,
  GetConversationsResponse,
  GetConversationResponse,
  MarkMessagesAsReadedResponse,
} from "@shared/types/http";
import {
  getUserConversations,
  getConversationById,
  markConversationMessagesAsRead,
} from "@/services";

export const getConversations: RequestHandler<
  any,
  GetConversationsResponse
> = async (req: Request, res) => {
  try {
    const userId = req.user?._id.toString();
    const conversations = await getUserConversations(userId);

    res.status(200).json({
      success: true,
      conversations,
    });
  } catch (error: any) {
    console.log("error in getConversations controller :", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getConversation: RequestHandler<
  ConversationParams,
  GetConversationResponse
> = async (req: Request<ConversationParams>, res) => {
  try {
    const conversationId: string = req.params.id;
    const userId = req.user?._id.toString();

    const conversation = await getConversationById(conversationId, userId);

    if (!conversation) {
      res.status(404).json({
        success: false,
        message: "Conversation not found or access denied",
      });
      return;
    }

    res.status(200).json({
      success: true,
      conversation,
    });
  } catch (error: any) {
    console.log("error in getConversation controller :", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const markMessagesAsReaded: RequestHandler<
  ConversationParams,
  MarkMessagesAsReadedResponse
> = async (
  req: Request<ConversationParams>,
  res: Response<MarkMessagesAsReadedResponse>,
) => {
  try {
    const conversationId: string = req.params.id;
    const userId = req.user?._id.toString();

    const conversation = await markConversationMessagesAsRead(
      conversationId,
      userId,
    );

    if (!conversation) {
      res.status(404).json({
        success: false,
        message: "Conversation not found or access denied",
      });
      return;
    }

    res.status(200).json({
      success: true,
      conversation,
    });
  } catch (error: any) {
    console.log("Error in markMessagesAsReaded controller : ", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
