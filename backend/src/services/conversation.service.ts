import { asPopulatedConversation } from "@/utils/typeHelpers.js";
import Conversation from "../models/conversation.model.js";
import { Conversation as ConversationType } from "@shared/types/models/conversation.js";
import { Types } from "mongoose";
import Message from "../models/message.model.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { CONVERSATION_ANALYSIS_PROMPT } from "@/prompts";
import { getMessages } from "./message.service.js";
import { log } from "console";

/**
 * Get all conversations for a user
 * @param userId - The user ID to get conversations for
 * @returns Array of conversations with populated data
 */
export const getUserConversations = async (
  userId: string
): Promise<ConversationType[]> => {
  try {
    const conversations = await Conversation.find({
      participants: { $elemMatch: { userId: userId } },
    })
      .populate("messages")
      .populate({ path: "participants.userId" });

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
  userId: string
): Promise<ConversationType | null> => {
  try {
    const conversation = await Conversation.findById(conversationId)
      .populate({ path: "participants.userId" })
      .populate("messages");
    if (!conversation) {
      return null;
    }

    // Check if user has access to this conversation
    const currentUserParticipant = conversation.participants.find(
      (participant: any) => participant.userId.equals(userId)
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
  userId: string
): Promise<ConversationType | null> => {
  try {
    const conversation = await Conversation.findById(conversationId)
      .populate({ path: "participants.userId" })
      .populate("messages");
    if (!conversation) {
      return null;
    }

    // Check if user has access to this conversation
    const currentUserParticipant = conversation.participants.find(
      (participant: any) => participant.userId.equals(userId)
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
  participants: string[]
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
  userId: string
): Promise<ConversationType | null> => {
  try {
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return null;
    }

    // Check if user is already a participant
    const existingParticipant = conversation.participants.find((p: any) =>
      p.userId.equals(userId)
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
  userId: string
): Promise<ConversationType | null> => {
  try {
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return null;
    }

    // Remove participant
    conversation.participants = conversation.participants.filter(
      (p: any) => !p.userId.equals(userId)
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
  userId: string
): Promise<number> => {
  try {
    const conversation = await Conversation.findByIdAndUpdate(conversationId);

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    const currentUserParticipant = conversation.participants.find(
      (participant: any) => participant.userId.equals(userId)
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

/**
 * Delete a conversation and all related messages
 * @param conversationId - The conversation ID
 */
export const deleteConversation = async (
  conversationId: string
): Promise<void> => {
  try {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return;
    }

    const messageIds = conversation.messages ?? [];
    if (messageIds.length > 0) {
      await Message.deleteMany({ _id: { $in: messageIds } });
    }

    await Conversation.findByIdAndDelete(conversationId);
  } catch (error: any) {
    console.error("Error deleting conversation:", error);
    throw new Error(error.message || "Failed to delete conversation");
  }
};

/**
 * Get AI insights for a conversation
 * @param conversationId - The conversation ID
 * @param userId - The current user ID for access control
 * @returns AI insights object or null if not found/access denied
 */
export const getConversationInsightsService = async (
  conversationId: string,
  userId: string
): Promise<{
  summary: string;
  sentiment: string;
  keyTakeaways: string[];
} | null> => {
  try {
    const conversation = await Conversation.findById(conversationId)
      .populate("messages")
      .populate({ path: "participants.userId" });

    if (!conversation) {
      return null;
    }

    // Check if user has access to this conversation
    const currentUserParticipant = conversation.participants.find(
      (participant: any) => participant.userId.equals(userId)
    );

    if (!currentUserParticipant) {
      return null;
    }

    // Get all messages for the conversation
    const messages = await getMessages(conversationId, userId);

    if (messages.length === 0) {
      return {
        summary: "No messages found in this conversation",
        sentiment: "neutral",
        keyTakeaways: ["Conversation is empty"],
      };
    }

    // Format messages for AI analysis
    const formattedMessages = messages
      .map((msg) => `${msg.senderId.fullName}: ${msg.message}`)
      .join("\n");

    // Initialize Google Gemini AI
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Create prompt for AI analysis
    const prompt = CONVERSATION_ANALYSIS_PROMPT(formattedMessages);

    // Generate AI insights
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from AI response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to parse AI response");
    }

    const insights = JSON.parse(jsonMatch[0]);

    // Validate and return insights
    return {
      summary: insights.summary || "Unable to generate summary",
      sentiment: insights.sentiment || "neutral",
      keyTakeaways: Array.isArray(insights.keyTakeaways)
        ? insights.keyTakeaways.slice(0, 3)
        : ["Unable to generate key takeaways"],
    };
  } catch (error: any) {
    console.error("Error getting conversation insights:", error);
    throw new Error("Failed to generate insights");
  }
};
