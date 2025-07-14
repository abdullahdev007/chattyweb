import { Request, RequestHandler, Response } from "express";
import Conversation from "../models/conversation.model.js";
import { ConversationParams } from "../types/requests/conversation.js";

// Controller: getConversations (uses req.user)
export const getConversations = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const conversations = await Conversation.find({
      participants: { $elemMatch: { userId: userId } },
    })
      .populate("messages")
      .populate({ path: "participants.userId" })
      .populate("latestMessage");
    res.status(200).json(conversations);
  } catch (error: any) {
    console.log("error in getConversations controller :", error.message);
    res.status(500).json("Internal server error");
  }
};

// Controller: getConversation (does not use req.user)
export const getConversation: RequestHandler<ConversationParams> = async (
  req: Request<ConversationParams>,
  res: Response
) => {
  try {
    const conversationId: string = req.params.id;
    const conversation = await Conversation.findById(conversationId)
      .populate({ path: "participants.userId" })
      .populate("messages")
      .populate("latestMessage");
    if (!conversation) {
      res.status(404).json({ error: "the conversation is not found" });
      return;
    }
    res.status(200).json(conversation);
  } catch (error: any) {
    console.log("error in getConversation controller :", error.message);
    res.status(500).json("Internal server error");
  }
};

// Controller: markMessagesAsReaded (uses req.user)
export const markMessagesAsReaded = async (
  req: Request<ConversationParams>,
  res: Response
) => {
  try {
    const conversationId: string = req.params.id;
    const conversation = await Conversation.findById(conversationId)
      .populate({ path: "participants.userId" })
      .populate("messages")
      .populate("latestMessage");
    if (!conversation)
      return res.status(404).json({ error: "the conversation is not found" });
    const currentUserParticipant = conversation.participants.find(
      (participant: any) => participant.userId.equals(req.user?._id)
    );
    if (!currentUserParticipant)
      return res
        .status(403)
        .json({ error: "You are not a participant in this conversation" });
    currentUserParticipant.unreadCount = 0;
    await conversation.save();
    res.status(200).json(conversation);
  } catch (error: any) {
    console.log("Error in markMessagesAsReaded controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
