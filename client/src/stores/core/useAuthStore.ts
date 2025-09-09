import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SafeUser } from "@shared/types/models/user";

interface AuthState {
  authUser: SafeUser | null;
  setAuthUser: (user: SafeUser | null) => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      authUser: null,
      setAuthUser: (user) => set({ authUser: user }),
    }),
    {
      name: "chattyweb_auth",
      partialize: (state) => ({ authUser: state.authUser }),
    },
  ),
);

export default useAuthStore;
