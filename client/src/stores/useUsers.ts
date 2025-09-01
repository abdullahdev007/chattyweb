import { SafeUser } from "@shared/types/models/user";
import { create } from "zustand";

interface UsersState {
  users: SafeUser[];
  setUsers: (users: SafeUser[]) => void;
}

const useUsers = create<UsersState>((set) => ({
  users: [],
  setUsers: (users: SafeUser[]) => set({ users }),
}));

export default useUsers;
