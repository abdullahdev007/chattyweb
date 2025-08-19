import { Request, RequestHandler } from "express";
import User from "../models/user.model.js";
import toSafeUser, { toSafeUsers } from "../utils/toSafeUser.js";
import {
  GetUserResponseBody,
  GetUsersResponseBody,
} from "@shared/types/http/modules/user.js";

export const getUsers: RequestHandler<any, GetUsersResponseBody, any> = async (
  req: Request,
  res,
) => {
  try {
    const loggedInUserId = req.user?._id;

    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    });

    res.status(200).json({ success: true, users: toSafeUsers(filteredUsers) });
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
    const user = await User.findById(userID);

    if (!user)
      res
        .status(404)
        .json({ success: false, message: `user with ${userID} not found` });
    else res.status(200).json({ success: true, user: toSafeUser(user) });
  } catch (error: any) {
    console.log("error in getUser controller :", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
