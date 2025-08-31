import { asPopulatedConversation } from "@/utils/typeHelpers.js";
import Conversation from "../models/conversation.model.js";
import { Conversation as ConversationType } from "@shared/types/models/conversation.js";
import { Types } from "mongoose";

/**
 * Get all conversations for a user
 * @param userId - The user ID to get conversations for
 * @returns Array of conversations with populated data
 */
export const getUserConversations = async (
  userId: string,
): Promise<ConversationType[]> => {
  try {
    const conversations = await Conversation.find({
      participants: { $elemMatch: { userId: userId } },
    })
      .populate("messages")
      .populate({ path: "participants.userId" })
      .populate("latestMessage");

    return conversations.map((conv) => asPopulatedConversation(conv));
  } catch (error: any) {
    console.error("Error getting user conversations:", error);
    throw new Error("Failed to get conversations");
  }
};

/**
 * Get a specific conversation by ID
 * @param conversationId - The conversation ID to find
 * @param userId - The current user ID for access control
 * @returns Conversation object or null if not found/access denied
 */
export const getConversationById = async (
  conversationId: string,
  userId: string,
): Promise<ConversationType | null> => {
  try {
    const conversation = await Conversation.findById(conversationId)
      .populate({ path: "participants.userId" })
      .populate("messages")
      .populate("latestMessage");

    if (!conversation) {
      return null;
    }

    // Check if user has access to this conversation
    const currentUserParticipant = conversation.participants.find(
      (participant: any) => participant.userId.equals(userId),
    );

    if (!currentUserParticipant) {
      return null;
    }

    return asPopulatedConversation(conversation);
  } catch (error: any) {
    console.error("Error getting conversation by ID:", error);
    throw new Error("Failed to get conversation");
  }
};

/**
 * Mark messages as read in a conversation
 * @param conversationId - The conversation ID
 * @param userId - The current user ID
 * @returns Updated conversation object or null if not found/access denied
 */
export const markConversationMessagesAsRead = async (
  conversationId: string,
  userId: string,
): Promise<ConversationType | null> => {
  try {
    const conversation = await Conversation.findById(conversationId)
      .populate({ path: "participants.userId" })
      .populate("messages")
      .populate("latestMessage");

    if (!conversation) {
      return null;
    }

    // Check if user has access to this conversation
    const currentUserParticipant = conversation.participants.find(
      (participant: any) => participant.userId.equals(userId),
    );

    if (!currentUserParticipant) {
      return null;
    }

    // Mark messages as read
    currentUserParticipant.unreadCount = 0;
    await conversation.save();

    return asPopulatedConversation(conversation);
  } catch (error: any) {
    console.error("Error marking conversation messages as read:", error);
    throw new Error("Failed to mark messages as read");
  }
};

/**
 * Create a new conversation between users
 * @param participants - Array of user IDs to include in conversation
 * @returns New conversation object
 */
export const createConversation = async (
  participants: string[],
): Promise<ConversationType> => {
  try {
    const conversation = new Conversation({
      participants: participants.map((userId) => ({
        userId: new Types.ObjectId(userId),
        unreadCount: 0,
      })),
    });

    await conversation.save();
    return asPopulatedConversation(conversation);
  } catch (error: any) {
    console.error("Error creating conversation:", error);
    throw new Error("Failed to create conversation");
  }
};

/**
 * Add participant to existing conversation
 * @param conversationId - The conversation ID
 * @param userId - The user ID to add
 * @returns Updated conversation object or null if not found
 */
export const addParticipantToConversation = async (
  conversationId: string,
  userId: string,
): Promise<ConversationType | null> => {
  try {
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return null;
    }

    // Check if user is already a participant
    const existingParticipant = conversation.participants.find((p: any) =>
      p.userId.equals(userId),
    );

    if (existingParticipant) {
      return asPopulatedConversation(conversation);
    }

    // Add new participant
    conversation.participants.push({
      userId: new Types.ObjectId(userId) as any,
      unreadCount: 0,
    });

    await conversation.save();
    return asPopulatedConversation(conversation);
  } catch (error: any) {
    console.error("Error adding participant to conversation:", error);
    throw new Error("Failed to add participant to conversation");
  }
};

/**
 * Remove participant from conversation
 * @param conversationId - The conversation ID
 * @param userId - The user ID to remove
 * @returns Updated conversation object or null if not found
 */
export const removeParticipantFromConversation = async (
  conversationId: string,
  userId: string,
): Promise<ConversationType | null> => {
  try {
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return null;
    }

    // Remove participant
    conversation.participants = conversation.participants.filter(
      (p: any) => !p.userId.equals(userId),
    );

    await conversation.save();
    return asPopulatedConversation(conversation);
  } catch (error: any) {
    console.error("Error removing participant from conversation:", error);
    throw new Error("Failed to remove participant from conversation");
  }
};

/**
 * Get unread message count for a conversation
 * @param conversationId - The conversation ID
 * @param userId - The user ID
 * @returns Unread message count
 */
export const getUnreadMessageCount = async (
  conversationId: string,
  userId: string,
): Promise<number> => {
  try {
    const conversation = await Conversation.findByIdAndUpdate(conversationId);

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    const currentUserParticipant = conversation.participants.find(
      (participant: any) => participant.userId.equals(userId),
    );

    if (!currentUserParticipant) {
      throw new Error("User not found in conversation");
    }

    return currentUserParticipant.unreadCount;
  } catch (error: any) {
    console.error("Error getting unread message count:", error);
    throw new Error(error.message || "Failed to get unread count");
  }
};
