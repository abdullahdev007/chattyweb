import type { Document, Types } from "mongoose";
import type { Gender } from "@/types/types";

// Base user interface (shared between frontend and backend)
export interface IUser {
  _id: Types.ObjectId;
  fullName: string;
  username: string;
  password: string;
  gender: Gender;
  profilePic?: string;
  friends: Types.ObjectId[];
  pendingFriendships: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  __v?: number;
}

// Mongoose document type (for backend only)
export type UserDocument = Document<unknown, any, IUser> & IUser;

// Safe user type without sensitive data (for frontend)
export type SafeUser = Omit<IUser, "password" | "__v">;