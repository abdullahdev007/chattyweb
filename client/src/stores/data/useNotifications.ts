import { create } from "zustand";
import { SafeNotification } from "@shared/types/models/notification";

interface NotificationsState {
  notifications: SafeNotification[];
  setNotifications: (notifications: SafeNotification[]) => void;
  addNotification: (notification: SafeNotification) => void;
  unReadedNotificationsCount: number;
  setUnReadedNotificationsCount: (count: number) => void;
  addUnReadedNotificationsCount: () => void;
}

const useNotifications = create<NotificationsState>((set) => ({
  notifications: [],
  setNotifications: (notifications) => set({ notifications }),
  addNotification: (notification) =>
    set((state) => ({
      ...state,
      notifications: [...state.notifications, notification],
    })),
  unReadedNotificationsCount: 0,
  setUnReadedNotificationsCount: (unReadedNotificationsCount) =>
    set({ unReadedNotificationsCount }),
  addUnReadedNotificationsCount: () =>
    set((state) => ({
      ...state,
      unReadedNotificationsCount: state.unReadedNotificationsCount + 1,
    })),
}));

export default useNotifications;
