import type { BaseResponse } from "../base";
import { SafeUser } from "@shared/types/models/user";

export interface SendFriendRequestParams {
  id: string; // friendId
}

export interface SendFriendRequestResponse extends BaseResponse {
  message?: string;
  error?: string;
}

export interface RespondFriendRequestParams {
  id: string; // friendId
}

export interface DeleteFriendRequestParams {
  id: string; // friendId
}


export interface RespondFriendRequestBody {
  response: "accept" | "reject";
}

export interface RespondFriendRequestResponse extends BaseResponse {
  message?: string;
  error?: string;
}

export interface GetFriendsResponse extends BaseResponse {
  friends?: SafeUser[];
  error?: string;
}

export interface GetFriendRequestsResponse extends BaseResponse {
  friendRequests?: SafeUser[];
  error?: string;
}
