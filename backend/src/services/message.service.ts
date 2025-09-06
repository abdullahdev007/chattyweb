import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getSocketId, io } from "../socket/socket.js";
import { Types } from "mongoose";
import {
  IMessage,
  Message as MessageType,
} from "@shared/types/models/message.js";
import { SendMessagePayload } from "@shared/types/socket/message.js";
import {
  asPopulatedConversation,
  asPopulatedMessage,
  asPopulatedMessages,
} from "@/utils/typeHelpers.js";
import {
  markConversationMessagesAsRead,
  getConversationById,
} from "@/services";

/**
 * Send a new message in a conversation
 * @param conversationId - The conversation ID
 * @param senderId - The sender user ID
 * @param message - The message content
 * @param replayTo - ( Optional ) message ID to reply to
 * @returns Object with conversation and new message
 */
export const sendMessage = async (
  conversationId: string,
  senderId: string,
  message: string,
  replayTo?: string,
): Promise<{ conversation: any; newMessage: any }> => {
  try {
    // Use conversation service to check access and get populated conversation
    let conversation = await getConversationById(conversationId, senderId);
    if (!conversation) {
      throw new Error("You are not a participant in this conversation");
    }

    // Get all other participants (receivers)
    const receiverParticipants = conversation.participants.filter(
      (user: any) => user.userId.id != senderId,
    );

    if (receiverParticipants.length === 0) {
      throw new Error("Conversation must have at least 2 participants");
    }

    // Update unread count for all receivers who are offline
    const onlineReceiverIds: string[] = [];
    receiverParticipants.forEach((participant: any) => {
      const receiverSocketId = getSocketId(participant.userId.id);
      if (receiverSocketId) {
        onlineReceiverIds.push(receiverSocketId);
      } else {
        // Increment unread count for offline users
        participant.unreadCount += 1;
      }
    });

    // Create the new message
    const newMessage = new Message({
      senderId,
      message,
      replayTo: replayTo ? (replayTo as any) : null,
    });

    // Get the conversation document to modify
    const conversationDoc = await Conversation.findById(conversationId);
    if (!conversationDoc) {
      throw new Error("Conversation not found");
    }

    conversationDoc.messages.push(newMessage._id);

    await Promise.all([conversationDoc.save(), newMessage.save()]);

    // Populate all necessary fields for proper typing
    await conversationDoc.populate([
      { path: "participants.userId" },
      { path: "messages" },
    ]);

    await newMessage.populate([{ path: "senderId" }, { path: "replayTo" }]);

    const populatedConversation = asPopulatedConversation(conversationDoc);
    const populatedMessage = asPopulatedMessage(newMessage);

    // Send socket notification to all online receivers
    onlineReceiverIds.forEach((socketId) => {
      const payload: SendMessagePayload = {
        conversation: populatedConversation,
        newMessage: populatedMessage,
      };

      io.to(socketId).emit("newMessage", payload);
    });

    return {
      conversation: populatedConversation,
      newMessage: populatedMessage,
    };
  } catch (error: any) {
    console.error("Error sending message:", error);
    throw new Error(error.message || "Failed to send message");
  }
};

/**
 * Get messages for a conversation
 * @param conversationId - The conversation ID
 * @param userId - The current user ID
 * @returns Array of populated messages
 */
export const getMessages = async (
  conversationId: string,
  userId: string,
): Promise<MessageType[]> => {
  try {
    const conversation = await Conversation.findById(conversationId).populate([
      { path: "participants.userId" },
      { path: "messages" },
    ]);

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    // Mark messages as read using conversation service
    await markConversationMessagesAsRead(conversationId, userId);

    const messages: IMessage[] = await Message.find({
      _id: { $in: conversation.messages },
    }).populate(["senderId", "replayTo"]);

    return asPopulatedMessages(messages);
  } catch (error: any) {
    console.error("Error getting messages:", error);
    throw new Error(error.message || "Failed to get messages");
  }
};

/**
 * Increase unread message count for a conversation
 * @param conversationId - The conversation ID
 * @param userId - The user ID to increase count for
 * @returns Updated conversation object
 */
export const increaseUnreadMessageCount = async (
  conversationId: string,
  userId: string,
): Promise<any> => {
  try {
    // Use conversation service to check access and get populated conversation
    const conversation = await getConversationById(conversationId, userId);
    if (!conversation) {
      throw new Error("You are not a participant in this conversation");
    }

    // Get the conversation document to modify
    const conversationDoc = await Conversation.findById(conversationId);
    if (!conversationDoc) {
      throw new Error("Conversation not found");
    }

    const receiverUserParticipant = conversationDoc.participants.find(
      (user: any) => user.userId.equals(userId),
    );

    if (!receiverUserParticipant) {
      throw new Error("You are not a participant in this conversation");
    }

    receiverUserParticipant.unreadCount++;
    await conversationDoc.save();

    // Populate before returning
    await conversationDoc.populate([
      { path: "participants.userId" },
      { path: "messages" },
    ]);

    return asPopulatedConversation(conversationDoc);
  } catch (error: any) {
    console.error("Error increasing unread message count:", error);
    throw new Error(error.message || "Failed to increase unread count");
  }
};
