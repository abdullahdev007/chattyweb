import NotificationTypes from "../types/NotificationTypes.js";
import Notification from "../models/notification.model.js";
import {
  INotification,
  SafeNotification,
} from "@shared/types/models/notification.js";
import { Document } from "mongoose";
import { getSocketId, io } from "../socket/socket.js";
import { IUser, UserDocument } from "@shared/types/models/user.js";
import toSafeUser from "./toSafeUser.js";
import { NewNotificationPayload } from "@shared/types/socket/notification.js";

const createNotification = async (
  sender: UserDocument,
  receiver: UserDocument,
  type: NotificationTypes,
): Promise<INotification | { error: string }> => {
  try {
    let existingNotification: (INotification & Document) | null = null;
    let notification: INotification & Document;
    // If notification type is NewMessage, check for existing unread notification
    if (type === NotificationTypes.NewMessage) {
      existingNotification = await Notification.findOne({
        senderId: sender._id,
        receiverId: receiver._id,
        type: NotificationTypes.NewMessage,
        readed: false,
      });
    }
    // If an existing unread notification was found, return it
    const message =
      type === NotificationTypes.NewFriendRequest
        ? `A new friend request from ${sender.fullName}`
        : type === NotificationTypes.FriendRequestAccepted
          ? `${sender.fullName}'s friend request has been accepted`
          : type === NotificationTypes.FriendRequestRejected
            ? `${sender.fullName}'s friend request was rejected`
            : type === NotificationTypes.RemoveFriendShip
              ? `${sender.fullName} removed your friendship with him`
              : type === NotificationTypes.NewMessage
                ? `New message from ${sender.fullName}`
                : "";

    if (existingNotification) {
      notification = existingNotification;
    } else {
      notification = new Notification({
        senderId: sender._id,
        receiverId: receiver._id,
        type,
        message,
      });
      await notification.populate("senderId");
      await notification.populate("receiverId");
      await notification.save();
    }

    const receiverSocketId = getSocketId(receiver._id.toString());
    if (receiverSocketId) {
      // Convert notifiaction to safe Notification
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
    // Return the newly created notification
    return notification;
  } catch (error: any) {
    // Return the error
    console.error("Error creating notification:", error);
    return { error: "Internal server error" };
  }
};

export default createNotification;
