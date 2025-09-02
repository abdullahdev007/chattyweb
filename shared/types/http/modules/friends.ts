import type { BaseResponse } from "@/types/http/base";
import { SafeUser } from "@/types/models/user";

export interface SendFriendRequestParams {
  id: string; // friendId
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


export interface GetFriendsResponse extends BaseResponse {
  friends?: SafeUser[];
}

export interface GetFriendRequestsResponse extends BaseResponse {
  friendRequests?: SafeUser[];
}
