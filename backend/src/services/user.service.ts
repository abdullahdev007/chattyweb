import User from "../models/user.model.js";
import { UserDocument } from "@shared/types/models/user.js";
import toSafeUser, { toSafeUsers } from "../utils/toSafeUser.js";

/**
 * Get all users except the current user
 * @param currentUserId - The ID of the current user to exclude
 * @param limit - Number of users to return (for pagination)
 * @param skip - Number of users to skip (for pagination)
 * @returns Array of safe user objects
 */
export const getAllUsersExceptCurrent = async (
  currentUserId: string,
  limit?: number,
  skip?: number,
): Promise<any[]> => {
  try {
    let query = User.find({ _id: { $ne: currentUserId } });

    if (limit) query = query.limit(limit);
    if (skip) query = query.skip(skip);

    const users = await query;
    return toSafeUsers(users);
  } catch (error: any) {
    console.error("Error getting all users except current:", error);
    throw new Error("Failed to get users");
  }
};

/**
 * Get a user by ID
 * @param userId - The user ID to find
 * @returns Safe user object or null if not found
 */
export const getUserById = async (userId: string): Promise<any | null> => {
  try {
    const user = await User.findById(userId);
    return user ? toSafeUser(user) : null;
  } catch (error: any) {
    console.error("Error getting user by ID:", error);
    throw new Error("Failed to get user");
  }
};

/**
 * Get users by search term (for future use)
 * @param searchTerm - The search term to match against username or fullName
 * @param currentUserId - The ID of the current user to exclude
 * @param limit - Number of users to return
 * @returns Array of safe user objects
 */
export const searchUsers = async (
  searchTerm: string,
  currentUserId: string,
  limit: number = 20,
): Promise<any[]> => {
  try {
    const users = await User.find({
      _id: { $ne: currentUserId },
      $or: [
        { username: { $regex: searchTerm, $options: "i" } },
        { fullName: { $regex: searchTerm, $options: "i" } },
      ],
    }).limit(limit);

    return toSafeUsers(users);
  } catch (error: any) {
    console.error("Error searching users:", error);
    throw new Error("Failed to search users");
  }
};

/**
 * Get users with pagination
 * @param currentUserId - The ID of the current user to exclude
 * @param page - Page number (starts from 1)
 * @param limit - Number of users per page
 * @returns Object with users and pagination info
 */
export const getUsersWithPagination = async (
  currentUserId: string,
  page: number = 1,
  limit: number = 20,
): Promise<{
  users: any[];
  total: number;
  page: number;
  totalPages: number;
}> => {
  try {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find({ _id: { $ne: currentUserId } })
        .skip(skip)
        .limit(limit),
      User.countDocuments({ _id: { $ne: currentUserId } }),
    ]);

    return {
      users: toSafeUsers(users),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error: any) {
    console.error("Error getting users with pagination:", error);
    throw new Error("Failed to get users with pagination");
  }
};
