import { Request, RequestHandler, Response } from "express";
import Conversation from "../models/conversation.model.js";
import {
  ConversationParams,
  GetConversationsResponse,
  GetConversationResponse,
  MarkMessagesAsReadedResponse,
} from "@shared/types/http";

export const getConversations: RequestHandler<
  any,
  GetConversationsResponse
> = async (req: Request, res) => {
  try {
    const userId = req.user?._id;
    const conversations = await Conversation.find({
      participants: { $elemMatch: { userId: userId } },
    })
      .populate("messages")
      .populate({ path: "participants.userId" })
      .populate("latestMessage");
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
    const conversation = await Conversation.findById(conversationId)
      .populate({ path: "participants.userId" })
      .populate("messages")
      .populate("latestMessage");
    if (!conversation) {
      res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
      return;
    }

    const currentUserParticipant = conversation.participants.find(
      (participant: any) => participant.userId.equals(req.user?._id)
    );
    if (!currentUserParticipant) {
      res.status(403).json({
        success: false,
        message: "You don't have access to this conversation",
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
  res: Response<MarkMessagesAsReadedResponse>
) => {
  try {
    const conversationId: string = req.params.id;
    const conversation = await Conversation.findById(conversationId)
      .populate({ path: "participants.userId" })
      .populate("messages")
      .populate("latestMessage");
    if (!conversation) {
      res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
      return;
    }
    const currentUserParticipant = conversation.participants.find(
      (participant: any) => participant.userId.equals(req.user?._id)
    );
    if (!currentUserParticipant) {
      res.status(403).json({
        success: false,
        message: "You are not a participant in this conversation",
      });

      return;
    }
    currentUserParticipant.unreadCount = 0;
    await conversation.save();
    res.status(200).json({
      success: true,
      conversation,
    });
  } catch (error: any) {
    console.log("Error in markMessagesAsReaded controller: ", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
