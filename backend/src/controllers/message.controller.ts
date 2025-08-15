import { Request, RequestHandler, Response } from "express";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getSocketId, io } from "../socket/socket.js";
import {
  ConversationParams,
  GetMessagesResponse,
  GetUnreadCountResponse,
  IncreaseUnReadCountResponse,
  SendMessageRequestBody,
  SendMessageResponse,
} from "@shared/types/http/index.js";
import { IMessage } from "@shared/types/models/message.js";
import { SendMessagePayload } from "@shared/types/socket/message.js";

export const sendMessage = async (
  req: Request<ConversationParams, SendMessageResponse, SendMessageRequestBody>,
  res: Response<SendMessageResponse>,
) => {
  try {
    const { message } = req.body;

    if (!message)
      return res
        .status(404)
        .json({ success: false, message: "Your message is empty !!" });
    const { id: conversationId } = req.params;

    let conversation = await Conversation.findById(conversationId).populate({
      path: "participants.userId",
    });

    if (!conversation) {
      res
        .status(404)
        .json({ success: false, message: "the conversation is not found" });
      return;
    }

    const receiverParticipant: any = conversation.participants.find(
      (user: any) => user.userId.id != req.user?._id!,
    );

    if (!receiverParticipant) {
      res.status(403).json({
        success: false,
        message: "You are not a participant in this conversation",
      });
      return;
    }

    const reciversocketId = getSocketId(receiverParticipant.userId.id);

    const unreadCount = reciversocketId ? 0 : 1;

    if (unreadCount > 0) receiverParticipant.unreadCount += 1;

    // Create the new message
    const newMessage = new Message({
      senderId: req.user?._id,
      receiverId: receiverParticipant.userId,
      message,
    });

    conversation.messages.push(newMessage._id);
    conversation.latestMessage = newMessage._id;

    await Promise.all([conversation.save(), newMessage.save()]);

    conversation = await conversation.populate("messages");
    await newMessage.populate("senderId");
    if (reciversocketId) {
      const payload: SendMessagePayload = { conversation, newMessage };

      io.to(reciversocketId).emit("newMessage", payload);
    }

    res.status(200).json({ success: true, conversation, newMessage });
  } catch (error: any) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getMessages = async (
  req: Request<ConversationParams, GetMessagesResponse>,
  res: Response<GetMessagesResponse>,
) => {
  try {
    const { id: conversationId } = req.params;

    const conversation =
      await Conversation.findByIdAndUpdate(conversationId).populate("messages");

    if (!conversation)
      return res
        .status(404)
        .json({ success: false, message: "the conversation is not found" });

    const currentUserParticipant = conversation.participants.find(
      (user: any) => user.userId.toString() == req.user?._id!,
    );

    if (currentUserParticipant) {
      currentUserParticipant.unreadCount = 0;
      await conversation.save();
    }

    const messages: IMessage[] = await Message.find({
      _id: { $in: conversation.messages },
    }).populate("senderId");

    res.status(200).json({ success: true, messages });
  } catch (error: any) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getUnReadedMessageCount = async (
  req: Request<ConversationParams, GetUnreadCountResponse>,
  res: Response<GetUnreadCountResponse>,
) => {
  try {
    const userId = req.user?._id;
    const conversationId = req.params.id;

    const conversation = await Conversation.findByIdAndUpdate(conversationId);

    if (!conversation)
      return res
        .status(404)
        .json({ success: false, message: "the conversation is not found" });

    const currentUserParticipant = conversation.participants.find(
      (participant: any) => participant.userId.equals(userId),
    );

    res.status(200).json({
      success: true,
      unreadCount: currentUserParticipant!.unreadCount,
    });
  } catch (error: any) {
    console.log("Error in getUnReadedMessageCount controller: ", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const increaseUnReadedMessage = async (
  req: Request<ConversationParams, IncreaseUnReadCountResponse>,
  res: Response<IncreaseUnReadCountResponse>,
) => {
  try {
    const conversationId = req.params.id;

    const conversation = await Conversation.findByIdAndUpdate(conversationId, {
      new: true,
    })
      .populate({ path: "participants.userId" })
      .populate("messages")
      .populate("latestMessage");

    if (!conversation) {
      return res
        .status(404)
        .json({ success: false, message: "the conversation is not found" });
    }

    const receiverUserParticipant = conversation.participants.find(
      (user: any) => {
        return user.userId.id == req.user?._id!;
      },
    );

    if (!receiverUserParticipant) {
      return res.status(403).json({
        success: false,
        message: "You are not a participant in this conversation",
      });
    }

    receiverUserParticipant.unreadCount++;

    await conversation.save();

    res.status(200).json({ success: true, conversation });
  } catch (error: any) {
    console.log("Error in increaseUnReadedMessage controller: ", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
