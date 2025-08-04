import mongoose, { Model } from "mongoose";
import type { IUser } from "@shared/types/models/user";

const userSchema = new mongoose.Schema<IUser & Document>(
  {
    fullName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female"],
    },
    profilePic: {
      type: String,
      default: "",
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    pendingFriendships: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
  },
  { timestamps: true },
);

const User: Model<IUser & Document> = mongoose.model<IUser & Document>(
  "User",
  userSchema,
);

export default User;
