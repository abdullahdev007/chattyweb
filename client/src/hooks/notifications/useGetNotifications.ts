import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useNotifications from "@/stores/useNotifications";
import { GetNotificationsResponse } from "@shared/types/http/modules/notification";
import { SafeNotification } from "@shared/types/models/notification";

const useGetNotifications = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { setNotifications, notifications, setUnReadedNotificationsCount } =
    useNotifications();

  useEffect(() => {
    const getNotifications = async () => {
      setLoading(true);

      try {
        const res = await fetch("/api/notifications");
        const data: GetNotificationsResponse = await res.json();
        if (!data.success || !data.notifications) {
          throw new Error(data.message || "Failed to fetch notifications");
        }

        const unreadCount = data.notifications.filter(
          (not: SafeNotification) => !not.readed
        ).length;
        setUnReadedNotificationsCount(unreadCount);
        setNotifications(data.notifications);
      } catch (error: unknown) {
        toast.error(
          error instanceof Error ? error.message : "An error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    getNotifications();
  }, [setNotifications, setUnReadedNotificationsCount]);

  return { loading, notifications };
};

export default useGetNotifications;
