import { Request, Response } from "express";
import Notification from "../models/notification.model.js";

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const notifications = await Notification.find({ receiverId: req.user!._id })
      .populate("senderId")
      .populate("receiverId");

    res.status(200).json(notifications);
  } catch (error: any) {
    console.log("Error in getNotifications controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const markAsReaded = async (req: Request, res: Response) => {
  try {
    const notifications = await Notification.find({ receiverId: req.user!.id });

    await Promise.all(
      notifications.map(async (notification: any) => {
        notification.readed = true;
        await notification.save();
      }),
    );

    res.status(200).json({ message: "Notifications marked as read" });
  } catch (error: any) {
    console.log("Error in markAsReaded controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const clearAll = async (req: Request, res: Response) => {
  try {
    await Notification.deleteMany({ receiverId: req.user!._id });

    res.status(200).json({ message: "Notifications cleared " });
  } catch (error: any) {
    console.log("Error in clearAll controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
