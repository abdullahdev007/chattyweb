import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import Notification from "../models/notification.model.js";
import { Request, RequestHandler } from "express";

import {
  BaseResponse,
  ChangePasswordRequestBody,
  LoginRequestBody,
  LoginResponseBody,
  SignupRequestBody,
  SignupResponseBody,
  UpdateProfileRequestBody,
  UpdateProfileResponseBody,
} from "@shared/types/http";
import toSafeUser from "../utils/toSafeUser.js";

export const signup: RequestHandler<
  any,
  SignupResponseBody,
  SignupRequestBody
> = async (req, res) => {
  try {
    const { fullName, username, password, confirmPassword, gender } = req.body;

    if (password !== confirmPassword) {
      res
        .status(400)
        .json({ success: false, message: "Passwords don't match" });
      return;
    }

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      res
        .status(400)
        .json({ success: false, message: "username already exists" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const newUser = new User({
      fullName,
      username,
      password: hashedPassword,
      gender,
      profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
    });

    if (newUser) {
      generateTokenAndSetCookie(newUser.id, res);
      await newUser.save();

      res.status(200).json({
        success: true,
        message: "Account created successfully",
        user: toSafeUser(newUser),
      });
    } else {
      res.status(400).json({ success: false, message: "Invalid user data" });
    }
  } catch (error: any) {
    console.log("error in signup controller :", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const login: RequestHandler<
  any,
  LoginResponseBody,
  LoginRequestBody
> = async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log(username, password);

    const user = await User.findOne({ username });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || "",
    );

    if (!user || !isPasswordCorrect) {
      res
        .status(400)
        .json({ success: false, message: "Invalid username or password" });
      return;
    }

    generateTokenAndSetCookie(user.id, res);

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: toSafeUser(user),
    });
  } catch (error: any) {
    console.log("error in login controller :", error.message);
    res.status(400).json({ success: false, message: "Invalid user data" });
  }
};

export const logout: RequestHandler<any, BaseResponse, any> = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error: any) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const changePassword: RequestHandler<
  any,
  BaseResponse,
  ChangePasswordRequestBody
> = async (req: Request<any, any, ChangePasswordRequestBody>, res) => {
  try {
    const { password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      res
        .status(400)
        .json({ success: false, message: "Passwords don't match" });
      return;
    }

    const user = await User.findById(req.user?._id);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user.password = hashedPassword;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password changed successfully" });
  } catch (error: any) {
    console.log("Error in changePassword controller", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const updateProfile: RequestHandler<
  any,
  UpdateProfileResponseBody,
  UpdateProfileRequestBody
> = async (req: Request<any, any, UpdateProfileRequestBody>, res) => {
  try {
    const { username, fullName, gender } = req.body;
    const user = await User.findById(req.user?._id);

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        res
          .status(400)
          .json({ success: false, message: "username already exists" });
        return;
      }
    }

    user.username = username;
    if (fullName) user.fullName = fullName;

    if (gender && gender !== user.gender) {
      user.gender = gender;
      user.profilePic = `https://avatar.iran.liara.run/public/${
        gender === "male" ? "boy" : "girl"
      }?username=${username}`;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: toSafeUser(user),
    });
  } catch (error: any) {
    console.log("Error in updateProfile controller", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteAccount: RequestHandler<any, BaseResponse, any> = async (
  req: Request,
  res,
) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }
    await Message.deleteMany({
      $or: [{ senderId: user._id }, { receiverId: user._id }],
    });
    await Conversation.deleteMany({ "participants.userId": user._id });
    await User.findByIdAndDelete(user._id);
    await Notification.deleteMany({
      $or: [{ senderId: user._id }, { receiverId: user._id }],
    });
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({
      success: true,
      message: "The account has been deleted successfully",
    });
  } catch (error: any) {
    console.log("Error in deleteAccount controller", error.message);
    res.status(500).json({ success: true, message: "Internal Server Error" });
  }
};
