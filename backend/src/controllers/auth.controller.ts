import bcrypt from "bcryptjs";
import User, { IUser } from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import Notification from "../models/notification.model.js";
import { Request, RequestHandler, Response } from "express";
import {
  ChangePasswordRequestBody,
  LoginRequestBody,
  SignupRequestBody,
  UpdateProfileRequestBody,
} from "../types/requests/auth.js";
import { AuthedRequest, AuthedRequestHandler } from "../types/express.js";

export const signup: RequestHandler<any, any, SignupRequestBody> = async (
  req,
  res,
) => {
  try {
    const { fullName, username, password, confirmPassword, gender } = req.body;

    if (password !== confirmPassword) {
      res.status(400).json({ error: "Passwords don't match" });
      return;
    }

    const user: IUser | null = await User.findOne({ username });

    if (user) {
      res.status(400).json({ error: "username already exists" });
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
      profilePic: gender == "male" ? boyProfilePic : girlProfilePic,
    });

    if (newUser) {
      generateTokenAndSetCookie(newUser.id, res);
      await newUser.save();

      const {
        password: userPassword,
        __v,
        ...returnUserObject
      } = newUser.toObject();

      res.status(200).json(returnUserObject);
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error: any) {
    console.log("error in signup controller :", error.message);
    res.status(500).json("Internal server error");
  }
};

export const login: RequestHandler<any, any, LoginRequestBody> = async (
  req,
  res,
) => {
  try {
    const { username, password } = req.body;

    const user: IUser | null = await User.findOne({ username });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || "",
    );

    if (!user || !isPasswordCorrect) {
      res.status(400).json({ error: "Invalid username or password" });
      return;
    }

    generateTokenAndSetCookie(user.id, res);

    const {
      password: userPassword,
      __v,
      ...returnUserObject
    } = user.toObject();

    res.status(200).json(returnUserObject);
  } catch (error: any) {
    console.log("error in login controller :", error.message);
    res.status(400).json({ error: "Invalid user data" });
  }
};

export const logout: RequestHandler = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error: any) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const changePassword = async (
  req: Request<any, any, ChangePasswordRequestBody>,
  res: Response,
) => {
  try {
    const { password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      res.status(400).json({ error: "Passwords don't match" });
      return;
    }
    const user: IUser | null = await User.findById(req.user?._id);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error: any) {
    console.log("Error in changePassword controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateProfile = async (
  req: Request<any, any, UpdateProfileRequestBody>,
  res: Response,
) => {
  try {
    const { username, fullName, gender } = req.body;
    const user: IUser | null = await User.findById(req.user?._id);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        res.status(400).json({ error: "username already exists" });
        return;
      }
    }

    user.username = username;
    user.fullName = fullName;

    if (gender !== user.gender) {
      user.gender = gender;
      user.profilePic = `https://avatar.iran.liara.run/public/${
        gender == "male" ? "boy" : "girl"
      }?username=${username}`;
    }
    await user.save();
    const {
      password: userPassword,
      __v,
      ...returnUserObject
    } = user.toObject();
    res.status(200).json(returnUserObject);
  } catch (error: any) {
    console.log("Error in updateProfile controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteAccount = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(404).json({ error: "User not found" });
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
    res.status(200).json("The account has been deleted successfully");
  } catch (error: any) {
    console.log("Error in deleteAccount controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
