import { Types } from "mongoose";
import User from "../models/user.model.js";
import Conversation from "../models/conversation.model.js";
import { UserDocument } from "@shared/types/models/user.js";
import { NotificationTypes } from "@shared/types/NotificationTypes.js";
import { createNotification } from "./notification.service.js";
import { getSocketId, io } from "../socket/socket.js";
import toSafeUser from "../utils/toSafeUser.js";
import { RespondToFriendRequestPayload } from "@shared/types/socket";
import { deleteConversation } from "./conversation.service.js";

/**
 * Send friend request to another user
 * @param senderId - The sender user ID
 * @param friendId - The friend user ID
 * @returns Success status and message
 */
export const sendFriendRequest = async (
  senderId: string,
  friendId: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const [sender, friend] = await Promise.all([
      User.findById(senderId),
      User.findById(friendId),
    ]);

    if (!friend || !sender) {
      throw new Error("User not found");
    }

    // Check if already friends
    if (friend.friends.includes(sender._id)) {
      throw new Error("Already friends");
    }

    // Check if friend request already sent
    if (friend.pendingFriendships.includes(sender._id)) {
      throw new Error("You already sent friend request to this user");
    }

    // Check if waiting for friend's response
    if (sender.pendingFriendships.includes(friend._id)) {
      throw new Error(
        "This user is already waiting for you to accept his friend request"
      );
    }

    // Add to pending friendships
    friend.pendingFriendships.push(sender._id);
    await friend.save();

    // Create notification
    await createNotification(
      sender,
      friend,
      NotificationTypes.NewFriendRequest
    );

    // Send socket notification
    const receiverSocketId = getSocketId(friendId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newFriendRequest", toSafeUser(sender));
    }

    return {
      success: true,
      message: "Your friend request has been sent successfully",
    };
  } catch (error: any) {
    console.error("Error sending friend request:", error);
    throw new Error(error.message || "Failed to send friend request");
  }
};

/**
 * Respond to friend request (accept/reject)
 * @param userId - The user ID responding to the request
 * @param requestUserId - The user ID who sent the request
 * @param response - The response (accept/reject)
 * @returns Success status and message
 */
export const respondToFriendRequest = async (
  userId: string,
  requestUserId: string,
  response: "accept" | "reject"
): Promise<{ success: boolean; message: string }> => {
  try {
    const [user, requestUser] = await Promise.all([
      User.findById(userId),
      User.findById(requestUserId),
    ]);

    if (!user || !requestUser) {
      throw new Error("User not found");
    }

    // Check if friend request exists
    const friendRequest = user.pendingFriendships.find(
      (id: any) => id.toString() === requestUserId
    );

    if (!friendRequest) {
      throw new Error("Friend request not found");
    }

    // Validate response
    if (!["accept", "reject"].includes(response)) {
      throw new Error("Invalid response");
    }

    // Remove from pending friendships
    user.pendingFriendships = user.pendingFriendships.filter(
      (id: any) => id.toString() !== requestUserId
    );

    if (response === "accept") {
      // Add to friends list
      user.friends.push(new Types.ObjectId(requestUserId));
      requestUser.friends.push(user._id);

      // Create conversation for friends
      await Conversation.create({
        participants: [
          { userId: user._id, unreadCount: 0 },
          { userId: new Types.ObjectId(requestUserId), unreadCount: 0 },
        ],
      });
    }

    // Save both users
    await Promise.all([user.save(), requestUser.save()]);

    // Create notification
    await createNotification(
      user,
      requestUser,
      response === "accept"
        ? NotificationTypes.FriendRequestAccepted
        : NotificationTypes.FriendRequestRejected
    );

    // Send socket notification
    const receiverSocketId = getSocketId(requestUserId);
    if (receiverSocketId) {
      const payload: RespondToFriendRequestPayload = {
        user: toSafeUser(user),
        response,
      };
      io.to(receiverSocketId).emit("respondToFriendRequest", payload);
    }

    return {
      success: true,
      message: `Friend request ${response === "accept" ? "accepted" : "rejected"}`,
    };
  } catch (error: any) {
    console.error("Error responding to friend request:", error);
    throw new Error(error.message || "Failed to respond to friend request");
  }
};

/**
 * Delete friend and remove all related data
 * @param userId - The user ID
 * @param friendId - The friend ID to delete
 * @returns Success status and message
 */
export const deleteFriend = async (
  userId: string,
  friendId: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const [user, friend] = await Promise.all([
      User.findById(userId),
      User.findById(friendId),
    ]);

    if (!friend || !user) {
      throw new Error("User not found");
    }

    // Check if they are friends
    if (!user.friends.includes(friend._id)) {
      throw new Error("This user is not one of your friends");
    }

    // Remove from friends list
    user.friends = user.friends.filter(
      (_id: Types.ObjectId) => !_id.equals(friend._id)
    );
    friend.friends = friend.friends.filter((_id) => !_id.equals(user._id));

    // Save both users
    await Promise.all([user.save(), friend.save()]);

    // Find their 1:1 conversation and delete it ( by conversation service )
    const conv = await Conversation.findOne({
      "participants.userId": { $all: [user._id, friend._id] },
    });
    if (conv) await deleteConversation(conv._id.toString());

    // Create notification
    await createNotification(user, friend, NotificationTypes.RemoveFriendShip);

    // Send socket notification
    const receiverSocketId = getSocketId(friendId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("deletedFromFriends", toSafeUser(user));
    }

    return {
      success: true,
      message: `${friend.fullName} has been removed from your friends list`,
    };
  } catch (error: any) {
    console.error("Error deleting friend:", error);
    throw new Error(error.message || "Failed to delete friend");
  }
};

/**
 * Get all friends for a user
 * @param userId - The user ID
 * @returns Array of friend objects
 */
export const getFriends = async (userId: string): Promise<any[]> => {
  try {
    const user = await User.findById(userId).populate<{
      friends: UserDocument[];
    }>("friends");

    if (!user) {
      throw new Error("User not found");
    }

    return user.friends.map((friend) => toSafeUser(friend));
  } catch (error: any) {
    console.error("Error getting friends:", error);
    throw new Error(error.message || "Failed to get friends");
  }
};

/**
 * Get all pending friend requests for a user
 * @param userId - The user ID
 * @returns Array of friend request objects
 */
export const getFriendRequests = async (userId: string): Promise<any[]> => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const friendRequests = await User.find({
      _id: { $in: user.pendingFriendships },
    });

    return friendRequests.map((user) => toSafeUser(user));
  } catch (error: any) {
    console.error("Error getting friend requests:", error);
    throw new Error(error.message || "Failed to get friend requests");
  }
};
