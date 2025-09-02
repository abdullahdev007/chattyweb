import { SafeUser } from "../models/user";
import { RespondFriendRequestBody } from "../http";

export interface FriendSocketEvents {
  // Response to friend request event
  respondToFriendRequest: {
    user: SafeUser;
    response: RespondFriendRequestBody["response"];
  };
  // New friend request event
  newFriendRequest: SafeUser;
  // Deleted from friends event
  deletedFromFriends: SafeUser;
}

// Individual event payloads
export type RespondToFriendRequestPayload =
  FriendSocketEvents["respondToFriendRequest"];
export type NewFriendRequestPayload = FriendSocketEvents["newFriendRequest"];
export type DeletedFromFriendsPayload =
  FriendSocketEvents["deletedFromFriends"];
