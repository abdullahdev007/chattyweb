import type { Request, RequestHandler, Response } from "express";
import Notification from "../models/notification.model.js";
import { GetNotificationsResponse } from "@shared/types/http/modules/notification.js";
import { BaseResponse } from "@shared/types/http/base.js";
import toSafeUser from "../utils/toSafeUser.js";
import { UserDocument } from "@shared/types/models/user.js";
import { SafeNotification } from "@shared/types/models/notification.js";

export const getNotifications: RequestHandler<
  any,
  GetNotificationsResponse
> = async (req: Request, res): Promise<void> => {
  try {
    const notifications = await Notification.find({ receiverId: req.user!._id })
      .populate<{ senderId: UserDocument }>("senderId")
      .populate<{ receiverId: UserDocument }>("receiverId");

    const safeNotifications: SafeNotification[] = notifications.map((n) => ({
      ...n.toObject(),
      senderId: toSafeUser(n.senderId as UserDocument),
      receiverId: toSafeUser(n.receiverId as UserDocument),
    }));

    res.status(200).json({
      success: true,
      notifications: safeNotifications,
    });
  } catch (error: any) {
    console.log("Error in getNotifications controller: ", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const markAsReaded = async (
  req: Request,
  res: Response<BaseResponse>,
): Promise<void> => {
  try {
    await Notification.updateMany(
      { receiverId: req.user!._id.toString() },
      { $set: { readed: true } },
    );
    res.status(200).json({
      success: true,
      message: "Notifications marked as read",
    });
  } catch (error: any) {
    console.log("Error in markAsReaded controller: ", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const clearAll: RequestHandler = async (
  req: Request,
  res: Response<BaseResponse>,
): Promise<void> => {
  try {
    if (!req.user?._id) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    await Notification.deleteMany({ receiverId: req.user?._id.toString() });

    res.status(200).json({
      success: true,
      message: "Notifications cleared",
    });
  } catch (error: any) {
    console.log("Error in clearAll controller: ", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
