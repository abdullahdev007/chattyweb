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
import { generateTokenAndSetCookie } from "../utils/auth.utils.js";
import {
  createUser,
  authenticateUser,
  updateUserPassword,
  updateUserProfile,
  deleteUserAccount,
} from "@/services";

export const signup: RequestHandler<
  any,
  SignupResponseBody,
  SignupRequestBody
> = async (req, res) => {
  try {
    const { fullName, username, password, gender } = req.body;

    const newUser = await createUser({ fullName, username, password, gender });

    generateTokenAndSetCookie(newUser.id, res);

    res.status(200).json({
      success: true,
      message: "Account created successfully",
      user: toSafeUser(newUser),
    });
  } catch (error: any) {
    console.log("error in signup controller :", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const login: RequestHandler<
  any,
  LoginResponseBody,
  LoginRequestBody
> = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await authenticateUser(username, password);

    generateTokenAndSetCookie(user.id, res);

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: toSafeUser(user),
    });
  } catch (error: any) {
    console.log("error in login controller :", error.message);
    res.status(400).json({
      success: false,
      message: error.message || "Invalid user data",
    });
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
    const { password } = req.body;
    const userId = req.user?._id.toString();

    await updateUserPassword(userId, password);

    res
      .status(200)
      .json({ success: true, message: "Password changed successfully" });
  } catch (error: any) {
    console.log("Error in changePassword controller", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const updateProfile: RequestHandler<
  any,
  UpdateProfileResponseBody,
  UpdateProfileRequestBody
> = async (req: Request<any, any, UpdateProfileRequestBody>, res) => {
  try {
    const { username, fullName, gender } = req.body;
    const userId = req.user?._id.toString();

    const updatedUser = await updateUserProfile(userId, {
      username,
      fullName,
      gender,
    });

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: toSafeUser(updatedUser),
    });
  } catch (error: any) {
    console.log("Error in updateProfile controller", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const deleteAccount: RequestHandler<any, BaseResponse, any> = async (
  req: Request,
  res,
) => {
  try {
    const userId = req.user?._id.toString();
    if (!userId) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    await deleteUserAccount(userId);

    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({
      success: true,
      message: "The account has been deleted successfully",
    });
  } catch (error: any) {
    console.log("Error in deleteAccount controller", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
