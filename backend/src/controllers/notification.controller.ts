import type { Request, RequestHandler, Response } from "express";
import { GetNotificationsResponse } from "@shared/types/http/modules/notification.js";
import { BaseResponse } from "@shared/types/http/base.js";
import toSafeUser from "@/utils/toSafeUser.js";
import { SafeNotification } from "@shared/types/models/notification.js";
import {
  getNotifications as getNotificationsService,
  markAllNotificationsAsRead,
  getUnreadNotificationsCount,
  deleteAllNotifications,
} from "@/services";

export const getNotifications: RequestHandler<
  any,
  GetNotificationsResponse
> = async (req: Request, res): Promise<void> => {
  try {
    const loggedInUserId = req.user!._id.toString();
    const page = parseInt(req.query.page as string) || 1;
    const limit = 12; // 12 notifications per page

    // Use pagination if page parameter is provided
    if (req.query.page) {
      const result = await getNotificationsService(loggedInUserId, page, limit);

      const safeNotifications: SafeNotification[] = result.notifications.map(
        (n) => ({
          ...(n as any).toObject(),
          senderId: toSafeUser(n.senderId as any),
          receiverId: toSafeUser(n.receiverId as any),
        }),
      );

      res.status(200).json({
        success: true,
        notifications: safeNotifications,
        total: result.total,
        page: result.page,
        totalPages: result.totalPages,
      });
    } else {
      // Fallback to old behavior for backward compatibility
      const notifications = await getNotificationsService(loggedInUserId);

      const safeNotifications: SafeNotification[] =
        notifications.notifications.map((n) => ({
          ...(n as any).toObject(),
          senderId: toSafeUser(n.senderId as any),
          receiverId: toSafeUser(n.receiverId as any),
        }));

      res.status(200).json({
        success: true,
        notifications: safeNotifications,
      });
    }
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
    await markAllNotificationsAsRead(req.user!._id.toString());

    res.status(200).json({ success: true });
  } catch (error: any) {
    console.log("Error in markAsReaded controller: ", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getUnreadCount = async (
  req: Request,
  res: Response<{ success: boolean; count: number }>,
): Promise<void> => {
  try {
    const count = await getUnreadNotificationsCount(req.user!._id.toString());

    res.status(200).json({
      success: true,
      count,
    });
  } catch (error: any) {
    console.log("Error in getUnreadCount controller: ", error.message);
    res.status(500).json({
      success: false,
      count: 0,
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
    await deleteAllNotifications(req.user?._id.toString());

    res.status(200).json({
      success: true,
    });
  } catch (error: any) {
    console.log("Error in clearAll controller: ", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
