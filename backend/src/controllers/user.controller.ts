import { Request, RequestHandler, Response } from "express";
import User from "../models/user.model.js";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const loggedInUserId = req.user?._id;

    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error: any) {
    console.log("error in getUsers controller :", error.message);
    res.status(500).json("Internal server error");
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select("-password -__v");

    res.status(200).json(user);
  } catch (error: any) {
    console.log("error in getUser controller :", error.message);
    res.status(500).json("Internal server error");
  }
};
