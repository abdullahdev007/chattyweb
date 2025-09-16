import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Response } from "express";
import User from "../models/user.model.js";

/**
 * Check if username already exists
 * @param username - The username to check
 * @returns True if username exists, false otherwise
 */
export const checkUsernameExists = async (
  username: string,
): Promise<boolean> => {
  try {
    const existingUser = await User.findOne({ username });
    return !!existingUser;
  } catch (error: any) {
    console.error("Error checking username existence:", error);
    throw new Error("Failed to check username");
  }
};

/**
 * Hash password using bcrypt
 * @param password - The plain text password
 * @returns Hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (error: any) {
    console.error("Error hashing password:", error);
    throw new Error("Failed to hash password");
  }
};

/**
 * Generate profile picture URL based on gender
 * @param username - The username
 * @param gender - The gender (male/female)
 * @returns Profile picture URL
 */
export const generateProfilePic = (
  username: string,
  gender: string,
): string => {
  const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
  const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;
  return gender === "male" ? boyProfilePic : girlProfilePic;
};

/**
 * Generate JWT token and set it as cookie
 * @param userId - The user ID
 * @param res - Express response object
 */
export const generateTokenAndSetCookie = (
  userId: string,
  res: Response,
): void => {
  const jwtSecret = process.env.JWT_SECRET || "";
  const token = jwt.sign({ userId }, jwtSecret);
  
  res.cookie("jwt", token, {
    secure: process.env.NODE_ENV !== "development",
    domain: process.env.DOMAIN,
    path: "/",
  });
};
