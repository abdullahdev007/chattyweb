import {
  NotificationTypes,
  NotificationType,
} from "@shared/types/NotificationTypes.js";
import Notification from "../models/notification.model.js";
import {
  INotification,
  SafeNotification,
} from "@shared/types/models/notification.js";
import { Document } from "mongoose";
import { getSocketId, io } from "../socket/socket.js";
import { UserDocument } from "@shared/types/models/user.js";
import toSafeUser from "../utils/toSafeUser.js";
import { NewNotificationPayload } from "@shared/types/socket/notification.js";

/**
 * Generate notification message based on type and sender
 * @param type - The type of notification
 * @param senderName - The name of the sender
 * @returns The formatted notification message
 */
const generateNotificationMessage = (
  type: NotificationType,
  senderName: string,
): string => {
  const messageMap: Record<NotificationType, string> = {
    [NotificationTypes.NewFriendRequest]: `A new friend request from ${senderName}`,
    [NotificationTypes.FriendRequestAccepted]: `${senderName}'s friend request has been accepted`,
    [NotificationTypes.FriendRequestRejected]: `${senderName}'s friend request was rejected`,
    [NotificationTypes.RemoveFriendShip]: `${senderName} removed your friendship with him`,
  };

  return messageMap[type] || "";
};

/**
 * Create a new notification document
 * @param sender - The sender user document
 * @param receiver - The receiver user document
 * @param type - The notification type
 * @param message - The notification message
 * @returns The created notification
 */
const createNotificationDocument = async (
  sender: UserDocument,
  receiver: UserDocument,
  type: NotificationType,
  message: string,
): Promise<INotification & Document> => {
  const notification = new Notification({
    senderId: sender._id,
    receiverId: receiver._id,
    type,
    message,
  });

  await notification.populate("senderId");
  await notification.populate("receiverId");
  await notification.save();

  return notification;
};

/**
 * Send real-time notification via socket
 * @param receiver - The receiver user document
 * @param sender - The sender user document
 * @param notification - The notification document
 */
const sendSocketNotification = (
  receiver: UserDocument,
  sender: UserDocument,
  notification: INotification & Document,
): void => {
  const receiverSocketId = getSocketId(receiver._id.toString());

  if (receiverSocketId) {
    const obj = notification.toObject();

    const safeNotification: SafeNotification = {
      ...obj,
      senderId: toSafeUser(sender),
      receiverId: toSafeUser(receiver),
    };

    const payload: NewNotificationPayload = {
      notification: safeNotification,
    };

    io.to(receiverSocketId).emit("newNotification", payload);
  }
};

/**
 * Create a notification and send it via socket
 * @param sender - The sender user document
 * @param receiver - The receiver user document
 * @param type - The notification type
 * @returns The created notification or error
 */
export const createNotification = async (
  sender: UserDocument,
  receiver: UserDocument,
  type: NotificationType,
): Promise<INotification | { error: string }> => {
  try {
    const message = generateNotificationMessage(type, sender.fullName);
    console.log("Creating new notification with type:", type);

    const notification = await createNotificationDocument(
      sender,
      receiver,
      type,
      message,
    );

    // Send real-time notification
    sendSocketNotification(receiver, sender, notification);

    return notification;
  } catch (error: any) {
    console.error("Error creating notification:", error);
    return { error: "Internal server error" };
  }
};
/**
 * Get notifications with pagination
 * @param userId - The user ID
 * @param page - Page number (starts from 1)
 * @param limit - Number of notifications per page
 * @returns Object with notifications and pagination info
 */
export const getNotifications = async (
  userId: string,
  page: number = 1,
  limit: number = 12,
): Promise<{
  notifications: INotification[];
  total: number;
  page: number;
  totalPages: number;
}> => {
  try {
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      Notification.find({ receiverId: userId })
        .populate("senderId")
        .populate("receiverId")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Notification.countDocuments({ receiverId: userId }),
    ]);

    return {
      notifications,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error: any) {
    console.error("Error getting notifications with pagination:", error);
    throw new Error("Failed to get notifications with pagination");
  }
};

/**
 * Mark all notifications as read for a user
 * @param userId - The user ID
 * @returns Number of updated notifications
 */
export const markAllNotificationsAsRead = async (
  userId: string,
): Promise<number> => {
  try {
    const result = await Notification.updateMany(
      { receiverId: userId, readed: false },
      { readed: true },
    );

    return result.modifiedCount;
  } catch (error: any) {
    console.error("Error marking all notifications as read:", error);
    throw new Error("Failed to mark all notifications as read");
  }
};

/**
 * Get unread notifications count for a user
 * @param userId - The user ID
 * @returns Number of unread notifications
 */
export const getUnreadNotificationsCount = async (
  userId: string,
): Promise<number> => {
  try {
    const count = await Notification.countDocuments({
      receiverId: userId,
      readed: false,
    });

    return count;
  } catch (error: any) {
    console.error("Error getting unread notifications count:", error);
    throw new Error("Failed to get unread notifications count");
  }
};

/**
 * Delete all notifications for a user
 * @param userId - The user ID
 * @returns Number of deleted notifications
 */
export const deleteAllNotifications = async (
  userId: string,
): Promise<number> => {
  try {
    const result = await Notification.deleteMany({ receiverId: userId });
    return result.deletedCount || 0;
  } catch (error: any) {
    console.error("Error deleting all notifications:", error);
    throw new Error("Failed to delete all notifications");
  }
};
