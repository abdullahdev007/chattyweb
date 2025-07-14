import { Request, Response } from "express";
import NotificationTypes from "../types/NotificationTypes.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import User, { IUser } from "../models/user.model.js";
import { getSocketId, io } from "../socket/socket.js";
import createNotification from "../utils/createNotifiation.js";
import {
  RespondFriendRequestBody,
  FriendIdParam,
} from "../types/requests/friends.js";

export const sendFriendRequest = async (
  req: Request<FriendIdParam>,
  res: Response
) => {
  try {
    const { id: friendId } = req.params;
    const userId = req.user.id;

    const frindUser = await User.findById(friendId);

    if (!frindUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    if (frindUser.friends.includes(userId)) {
      res.status(400).json({ error: "Already friends" });
      return;
    }
    if (frindUser.pendingFriendships.includes(userId)) {
      res.status(400).json({ error: "Friend request already sent" });
      return;
    }

    frindUser.pendingFriendships.push(userId);

    await frindUser.save();

    // Create Notification
    createNotification(req.user, frindUser, NotificationTypes.NewFriendRequest);

    // Socket io
    const receiverSocketId = getSocketId(friendId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newFriendRequest", req.user);
    }

    res
      .status(200)
      .json({ message: "Your friend request has been sent successfully" });
  } catch (error: any) {
    console.log("error in sendFriendRequest controller :", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const respondFriendRequest = async (
  req: Request<FriendIdParam, any, RespondFriendRequestBody>,
  res: Response
) => {
  try {
    const { id: requestUserId } = req.params;
    const { response } = req.body;
    const user = req.user;

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (!user.pendingFriendships.includes(requestUserId)) {
      res.status(404).json({ error: "Friend request not found" });
      return;
    }

    if (response !== "accept" && response !== "reject") {
      res.status(400).json({ error: "Invalid response" });
      return;
    }

    user.pendingFriendships = user.pendingFriendships.filter(
      (id: string) => id != requestUserId
    );

    const requestUser: IUser | null = await User.findById(requestUserId);

    if (requestUser === null) {
      res.status(400).json({ error: "request user not found " });
      return;
    }

    if (response === "accept") {
      requestUser.friends.push(user.id);
      user.friends.push(requestUserId);
      await Conversation.create({
        participants: [{ userId: requestUserId }, { userId: user._id }],
      });

      await requestUser.save();
    }

    await user.save();

    createNotification(
      user,
      requestUser,
      response === "accept"
        ? NotificationTypes.FriendRequestAccepted
        : NotificationTypes.FriendRequestRejected
    );

    const receiverSocketId = getSocketId(requestUserId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("respondToFriendRequest", {
        user,
        response,
      });
    }

    res.json({
      message: `Friend request ${
        response === "accept" ? "accepted" : "rejected"
      }`,
    });
  } catch (error: any) {
    console.log("error in respondFriendRequest controller :", error.message);
    res.status(500).json("Internal server error");
  }
};

export const deleteFriend = async (
  req: Request<FriendIdParam>,
  res: Response
) => {
  try {
    const { id: friendId } = req.params;
    const user = req.user;

    const friend = await User.findById(friendId);

    if (!friend) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (!user.friends.includes(friendId)) {
      res.status(404).json({ error: "This user is not one of your friends" });
      return;
    }

    user.friends = user.friends.filter((id: string) => id != friendId);
    friend.friends = friend.friends.filter((id) => id != user.id);

    await user.save();
    await friend.save();

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
      io.to(receiverSocketId).emit("deletedFromFriends", user);
    }

    res.json({
      message: `${friend.fullName} has been removed from your friends list`,
    });
  } catch (error: any) {
    console.log("error in deleteFriend controller :", error.message);
    res.status(500).json("Internal server error");
  }
};

export const getFriendRequests = async (req: Request, res: Response) => {
  try {
    const userIds = req.user.pendingFriendships;
    const friendRequests = await User.find({ _id: { $in: userIds } });
    res.status(200).json(friendRequests);
  } catch (error: any) {
    console.log("Error in getFriendRequests controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getFriends = async (req: Request, res: Response) => {
  try {
    const userIds = req.user.friends;
    const friends = await User.find({ _id: { $in: userIds } }).select(
      "-password -__v"
    );
    res.status(200).json(friends);
  } catch (error: any) {
    console.log("Error in getFriends controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
