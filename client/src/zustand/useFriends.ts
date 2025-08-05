import { create } from "zustand";
import { SafeUser } from "@shared/types/models/user";

interface FriendsState {
  friends: SafeUser[];
  setFriends: (friends: SafeUser[]) => void;
  addFriend: (friend: SafeUser) => void;
  removeFriend: (friendId: string) => void;
}

const useFriends = create<FriendsState>((set) => ({
  friends: [],
  setFriends: (friends) => set({ friends }),
  addFriend: (friend) =>
    set((state) => ({ ...state, friends: [...state.friends, friend] })),
  removeFriend: (friendId) =>
    set((state) => ({
      ...state,
      friends: state.friends.filter((f) => f._id !== friendId),
    })),
}));

export default useFriends;
