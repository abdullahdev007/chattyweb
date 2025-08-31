import { Request, Response } from "express";
import {
  SendFriendRequestParams,
  RespondFriendRequestParams,
  RespondFriendRequestBody,
  GetFriendsResponse,
  GetFriendRequestsResponse,
  DeleteFriendRequestParams,
  BaseResponse,
} from "@shared/types/http";
import {
  sendFriendRequest as sendFriendRequestService,
  respondToFriendRequest,
  deleteFriend as deleteFriendService,
  getFriends as getFriendsService,
  getFriendRequests as getFriendRequestsService,
} from "@/services";

export const sendFriendRequest = async (
  req: Request<SendFriendRequestParams>,
  res: Response<BaseResponse>,
) => {
  try {
    const { id: friendId } = req.params;
    const userId = req.user?._id.toString();

    const result = await sendFriendRequestService(userId, friendId);

    res.status(200).json(result);
  } catch (err: any) {
    console.log("Error in sendFriendRequest: ", err.message);
    res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
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
    const userId = req.user?._id.toString();

    const result = await respondToFriendRequest(
      userId,
      requestUserId,
      response,
    );

    res.json(result);
  } catch (err: unknown) {
    const error = err as Error;
    console.log("Error in respondToFriendRequest: ", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const deleteFriend = async (
  req: Request<DeleteFriendRequestParams>,
  res: Response<BaseResponse>,
) => {
  try {
    const { id: friendId } = req.params;
    const userId = req.user?._id.toString();

    const result = await deleteFriendService(userId, friendId);

    res.json(result);
  } catch (err: unknown) {
    const error = err as Error;
    console.log("error in deleteFriend controller :", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const getFriends = async (
  req: Request,
  res: Response<GetFriendsResponse>,
) => {
  try {
    const userId = req.user?._id.toString();

    const friends = await getFriendsService(userId);

    res.status(200).json({
      success: true,
      friends,
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.log("Error in getFriends: ", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const getFriendRequests = async (
  req: Request,
  res: Response<GetFriendRequestsResponse>,
) => {
  try {
    const userId = req.user?._id.toString();

    const friendRequests = await getFriendRequestsService(userId);

    res.status(200).json({
      success: true,
      friendRequests,
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.log("Error in getFriendRequests: ", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
