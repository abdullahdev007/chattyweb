import { Request, RequestHandler, Response } from "express";
import Conversation from "../models/conversation.model.js";
import Message, { IMessage } from "../models/message.model.js";
import { getSocketId, io } from "../socket/socket.js";
import { SendMessageBody } from "../types/requests/message.js";
import { ConversationParams } from "../types/requests/conversation.js";

export const sendMessage = async (
  req: Request<ConversationParams, any, SendMessageBody>,
  res: Response
) => {
  try {
    const { message } = req.body;
    const { id: conversationId } = req.params;

    let conversation = await Conversation.findById(conversationId).populate({
      path: "participants.userId",
    });

    if (!conversation) {
      res.status(404).json({ error: "the conversation is not found" });
      return;
    }

    const receiverParticipant = conversation.participants.find(
      (user: any) => user.userId.id != req.user.id
    );

    if (!receiverParticipant) {
      res
        .status(403)
        .json({ error: "You are not a participant in this conversation" });
      return;
    }

    const reciversocketId = getSocketId(
      receiverParticipant.userId._id.toString()
    );

    const unreadCount = reciversocketId ? 0 : 1;

    if (unreadCount > 0) receiverParticipant.unreadCount += 1;

    // Create the new message
    const newMessage: IMessage = new Message({
      senderId: req.user._id,
      receiverId: receiverParticipant.userId,
      message,
    });

    conversation.messages.push(newMessage._id);
    conversation.latestMessage = newMessage._id;

    await Promise.all([conversation.save(), newMessage.save()]);

    conversation = await conversation.populate("messages");
    await newMessage.populate("senderId");
    if (reciversocketId) {
      io.to(reciversocketId).emit("newMessage", { conversation, newMessage });
    }

    res.status(201).json({ conversation, newMessage });
  } catch (error: any) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (
  req: Request<ConversationParams>,
  res: Response
) => {
  try {
    const { id: conversationId } = req.params;

    const conversation = await Conversation.findByIdAndUpdate(
      conversationId
    ).populate("messages");

    if (!conversation)
      return res.status(404).json({ error: "the conversation is not found" });

    const currentUserParticipant = conversation.participants.find(
      (user: any) => user.userId.toString() == req.user.id
    );

    if (currentUserParticipant) {
      currentUserParticipant.unreadCount = 0;
      await conversation.save();
    }

    const messages = await Message.find({
      _id: { $in: conversation.messages },
    }).populate("senderId");

    res.status(200).json(messages);
  } catch (error: any) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUnReadedMessageCount = async (
  req: Request<ConversationParams>,
  res: Response
) => {
  try {
    const userId = req.user.id;
    const conversationId = req.params.id;

    const conversation = await Conversation.findByIdAndUpdate(conversationId);

    if (!conversation)
      return res.status(404).json({ error: "the conversation is not found" });

    const currentUserParticipant = conversation.participants.find(
      (participant: any) => participant.userId.equals(userId)
    );

    res.status(200).json(currentUserParticipant!.unreadCount);
  } catch (error: any) {
    console.log("Error in getUnReadedMessageCount controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const increaseUnReadedMessage = async (
  req: Request<ConversationParams>,
  res: Response
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
      return res.status(404).json({ error: "the conversation is not found" });
    }

    const receiverUserParticipant = conversation.participants.find(
      (user: any) => {
        return user.userId.id == req.user.id;
      }
    );

    if (!receiverUserParticipant) {
      return res
        .status(403)
        .json({ error: "You are not a participant in this conversation" });
    }

    receiverUserParticipant.unreadCount++;

    await conversation.save();

    res.status(200).json(conversation);
  } catch (error: any) {
    console.log("Error in increaseUnReadedMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
