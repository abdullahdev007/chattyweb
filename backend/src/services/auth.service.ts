import User from "../models/user.model.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import Notification from "../models/notification.model.js";
import { UserDocument } from "@shared/types/models/user.js";
import { Gender } from "@shared/types/types.js";
import {
  checkUsernameExists,
  hashPassword,
  generateProfilePic,
} from "../utils/auth.utils.js";
import bcrypt from "bcryptjs";
/**
 * Create a new user account
 * @param userData - User data (fullName, username, password, gender)
 * @returns Created user object
 */
export const createUser = async (userData: {
  fullName: string;
  username: string;
  password: string;
  gender: string;
}): Promise<UserDocument> => {
  try {
    const { fullName, username, password, gender } = userData;

    // Check if username exists
    const usernameExists = await checkUsernameExists(username);
    if (usernameExists) {
      throw new Error("Username already exists");
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Generate profile picture
    const profilePic = generateProfilePic(username, gender);

    // Create new user
    const newUser = new User({
      fullName,
      username,
      password: hashedPassword,
      gender,
      profilePic,
    });

    await newUser.save();
    return newUser;
  } catch (error: any) {
    console.error("Error creating user:", error);
    throw new Error(error.message || "Failed to create user");
  }
};

/**
 * Authenticate user login
 * @param username - The username
 * @param password - The password
 * @returns User object if authentication successful
 */
export const authenticateUser = async (
  username: string,
  password: string
): Promise<UserDocument> => {
  try {
    const user = await User.findOne({ username });
    if (!user) {
      throw new Error("Invalid username or password");
    }

    // Import bcrypt for password comparison
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new Error("Invalid username or password");
    }

    return user;
  } catch (error: any) {
    console.error("Error authenticating user:", error);
    throw new Error(error.message || "Authentication failed");
  }
};

/**
 * Update user password
 * @param userId - The user ID
 * @param newPassword - The new password
 * @returns Updated user object
 */
export const updateUserPassword = async (
  userId: string,
  newPassword: string
): Promise<UserDocument> => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    await user.save();

    return user;
  } catch (error: any) {
    console.error("Error updating password:", error);
    throw new Error(error.message || "Failed to update password");
  }
};

/**
 * Update user profile
 * @param userId - The user ID
 * @param profileData - Profile data to update
 * @returns Updated user object
 */
export const updateUserProfile = async (
  userId: string,
  profileData: {
    username?: string;
    fullName?: string;
    gender?: Gender;
  }
): Promise<UserDocument> => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const { username, fullName, gender } = profileData;

    // Check username uniqueness if changed
    if (username && username !== user.username) {
      const usernameExists = await checkUsernameExists(username);
      if (usernameExists) {
        throw new Error("Username already exists");
      }
      user.username = username;
    }

    // Update other fields
    if (fullName) user.fullName = fullName;

    if (gender && gender !== user.gender) {
      user.gender = gender;
      user.profilePic = generateProfilePic(user.username, gender);
    }

    await user.save();
    return user;
  } catch (error: any) {
    console.error("Error updating profile:", error);
    throw new Error(error.message || "Failed to update profile");
  }
};

/**
 * Delete user account and all related data
 * @param userId - The user ID to delete
 * @returns Success status
 */
export const deleteUserAccount = async (userId: string): Promise<boolean> => {
  try {
    // Delete all user-related data
    await Promise.all([
      Message.deleteMany({
        $or: [{ senderId: userId }, { receiverId: userId }],
      }),
      Conversation.deleteMany({ "participants.userId": userId }),
      User.findByIdAndDelete(userId),
      Notification.deleteMany({
        $or: [{ senderId: userId }, { receiverId: userId }],
      }),
    ]);

    return true;
  } catch (error: any) {
    console.error("Error deleting user account:", error);
    throw new Error("Failed to delete account");
  }
};
