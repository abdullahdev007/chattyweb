import { create } from "zustand";
import { SafeUser } from "@shared/types/models/user";

interface FriendRequestsState {
  friendRequests: SafeUser[];
  setFriendRequests: (friendRequests: SafeUser[]) => void;
  addFriendRequest: (friendRequest: SafeUser) => void;
  removeFriendRequest: (friendId: string) => void;
}

const useFriendRequests = create<FriendRequestsState>((set) => ({
  friendRequests: [],
  setFriendRequests: (friendRequests) => set({ friendRequests }),
  addFriendRequest: (friendRequest) =>
    set((state) => ({
      ...state,
      friendRequests: [...state.friendRequests, friendRequest],
    })),
  removeFriendRequest: (friendId) =>
    set((state) => ({
      ...state,
      friendRequests: state.friendRequests.filter(
        (req) => req._id.toString() !== friendId
      ),
    })),
}));

export default useFriendRequests;
