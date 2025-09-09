import { Request, RequestHandler } from "express";
import {
  GetUserResponseBody,
  GetUsersQuery,
  GetUsersResponseBody,
} from "@shared/types/http/modules/user.js";
import {
  getAllUsersExceptCurrent,
  getUserById,
  getUsers as getUsersService,
} from "@/services";

export const getUsers: RequestHandler<
  any,
  GetUsersResponseBody,
  any,
  GetUsersQuery
> = async (
  req: Request<any, GetUsersResponseBody, any, GetUsersQuery>,
  res,
) => {
  try {
    const loggedInUserId = req.user?._id.toString();

    // Get page parameter from query
    const page = req.query.page || 1;
    const limit = 8; // Fixed page size for simplicity

    // Use pagination if page parameter is provided
    if (req.query.page) {
      const result = await getUsersService(loggedInUserId, page, limit);
      res.status(200).json({
        success: true,
        users: result.users,
        pagination: {
          total: result.total,
          page: result.page,
          totalPages: result.totalPages,
        },
      });
    } else {
      // Fallback to old behavior for backward compatibility
      const users = await getAllUsersExceptCurrent(loggedInUserId);
      res.status(200).json({ success: true, users });
    }
  } catch (error: any) {
    console.log("error in getUsers controller :", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getUser: RequestHandler<any, GetUserResponseBody, any> = async (
  req,
  res,
) => {
  try {
    const userID: string = req.params.id;
    const user = await getUserById(userID);

    if (!user) {
      res
        .status(404)
        .json({ success: false, message: `user with ${userID} not found` });
    } else {
      res.status(200).json({ success: true, user });
    }
  } catch (error: any) {
    console.log("error in getUser controller :", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
