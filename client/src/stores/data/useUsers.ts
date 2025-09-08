import { SafeUser } from "@shared/types/models/user";
import { create } from "zustand";

interface UsersState {
  users: SafeUser[];
  setUsers: (users: SafeUser[]) => void;
  addUser: (user: SafeUser) => void;
  updateUser: (userId: string, updates: Partial<SafeUser>) => void;
  removeUser: (userId: string) => void;
  clearUsers: () => void;
}

const useUsers = create<UsersState>((set) => ({
  users: [],

  setUsers: (users: SafeUser[]) => set({ users }),

  addUser: (user: SafeUser) =>
    set((state) => ({
      users: [...state.users, user],
    })),

  updateUser: (userId: string, updates: Partial<SafeUser>) =>
    set((state) => ({
      users: state.users.map((user) =>
        user._id.toString() === userId ? { ...user, ...updates } : user,
      ),
    })),

  removeUser: (userId: string) =>
    set((state) => ({
      users: state.users.filter((user) => user._id.toString() !== userId),
    })),

  clearUsers: () => set({ users: [] }),
}));

export default useUsers;
