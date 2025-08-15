import { Request, Response } from "express";
import NotificationTypes from "../types/NotificationTypes.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import { getSocketId, io } from "../socket/socket.js";
import createNotification from "../utils/createNotifiation.js";
import toSafeUser from "../utils/toSafeUser.js";
import {
  SendFriendRequestParams,
  RespondFriendRequestParams,
  RespondFriendRequestBody,
  GetFriendsResponse,
  GetFriendRequestsResponse,
  DeleteFriendRequestParams,
  BaseResponse,
} from "@shared/types/http";
import { UserDocument } from "@shared/types/models/user.js";
import { RespondToFriendRequestPayload } from "@shared/types/socket";
import { Types } from "mongoose";
import { SyncAuthUserPayload } from "@shared/types/socket/auth.js";

export const sendFriendRequest = async (
  req: Request<SendFriendRequestParams>,
  res: Response<BaseResponse>,
) => {
  try {
    const { id: friendId } = req.params;
    const user = req.user;
    const friend = await User.findById(friendId);

    if (!friend || !user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    if (friend.friends.includes(user._id)) {
      res.status(400).json({ success: false, message: "Already friends" });
      return;
    }

    if (user.pendingFriendships.includes(friend._id)) {
      res.status(500).json({
        success: false,
        message:
          "This user is already waiting for you to accept his friend request.",
      });

      return;
    }

    friend.pendingFriendships.push(user._id);

    await friend.save();

    // Create Notification
    createNotification(req.user!, friend, NotificationTypes.NewFriendRequest);

    // Socket io
    const receiverSocketId = getSocketId(friendId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newFriendRequest", toSafeUser(req.user!));
    }

    res.status(200).json({
      success: true,
      message: "Your friend request has been sent successfully",
    });
  } catch (err: any) {
    console.log("Error in sendFriendRequest: ", err.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const respondFriendRequest = async (
  req: Request<
    RespondFriendRequestParams,
    BaseResponse,
    RespondFriendRequestBody
  >,
  res: Response<BaseResponse>,
) => {
  try {
    const { id: requestUserId } = req.params;
    const { response } = req.body;
    const user = req.user;

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    const friendRequest = user.pendingFriendships.find(
      (id) => id.toString() === requestUserId,
    );

    if (!friendRequest) {
      res
        .status(404)
        .json({ success: false, message: "Friend request not found" });
      return;
    }

    if (!["accept", "reject"].includes(response)) {
      res.status(400).json({ success: false, message: "Invalid response" });
      return;
    }

    // Remove the friend request from the pending list

    const requestUser = await User.findById(requestUserId);

    if (!requestUser) {
      res
        .status(400)
        .json({ success: false, message: "request user not found" });
      return;
    }

    user.pendingFriendships = user.pendingFriendships.filter(
      (id) => id.toString() !== requestUserId,
    );

    if (response === "accept") {
      // Add each user to the other's friends list
      user.friends.push(new Types.ObjectId(requestUserId));

      requestUser.friends.push(user._id);

      // Create a new conversation for the friends
      await Conversation.create({
        participants: [
          {
            userId: user._id,
          },
          {
            userId: new Types.ObjectId(requestUserId),
          },
        ],
      });
    }

    await Promise.all([user.save(), requestUser.save()]);

    createNotification(
      user,
      requestUser,
      response === "accept"
        ? NotificationTypes.FriendRequestAccepted
        : NotificationTypes.FriendRequestRejected,
    );

    const receiverSocketId = getSocketId(requestUserId);
    if (receiverSocketId) {
      const payload: RespondToFriendRequestPayload = {
        user: toSafeUser(user),
        response,
      };
      io.to(receiverSocketId).emit("respondToFriendRequest", payload);
    }

    res.json({
      success: true,
      message: `Friend request ${
        response === "accept" ? "accepted" : "rejected"
      }`,
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.log("Error in respondToFriendRequest: ", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const deleteFriend = async (
  req: Request<DeleteFriendRequestParams>,
  res: Response<BaseResponse>,
) => {
  try {
    const { id: friendId } = req.params;
    const user = req.user;

    const friend = await User.findById(friendId);

    if (!friend) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    if (!user?.friends.includes(friend._id)) {
      res.status(404).json({
        success: false,
        message: "This user is not one of your friends",
      });
      return;
    }

    user.friends = user.friends.filter(
      (_id: Types.ObjectId) => !_id.equals(friend._id),
    );

    friend.friends = friend.friends.filter((_id) => !_id.equals(user._id));

    await Promise.all([user.save(), friend.save()]);

    await Conversation.findOneAndDelete({
      "participants.userId": { $all: [user._id, friend._id] },
    });

    await Message.deleteMany({
      $or: [
        { senderId: user._id, receiverId: friend._id },
        { senderId: friend._id, receiverId: user._id },
      ],
    });

    createNotification(user, friend, NotificationTypes.RemoveFriendShip);

    // Socket io
    const receiverSocketId = getSocketId(friendId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("deletedFromFriends", toSafeUser(user));
    }

    res.json({
      success: true,
      message: `${friend.fullName} has been removed from your friends list`,
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.log("error in deleteFriend controller :", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getFriends = async (
  req: Request,
  res: Response<GetFriendsResponse>,
) => {
  try {
    const userId = req.user?._id;

    const user = await User.findById(userId).populate<{
      friends: UserDocument[];
    }>("friends");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      friends: user.friends.map((friend) => toSafeUser(friend)),
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.log("Error in getFriends: ", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getFriendRequests = async (
  req: Request,
  res: Response<GetFriendRequestsResponse>,
) => {
  try {
    const userIds = req.user?.pendingFriendships;

    // Find users whose IDs are in the pendingFriendships array
    const friendRequests = await User.find({ _id: { $in: userIds } });

    res.status(200).json({
      success: true,
      friendRequests: friendRequests.map((user) => toSafeUser(user)),
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.log("Error in getFriendRequests: ", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
