import { useState } from "react";
import toast from "react-hot-toast";
import useNotifications from "@/stores/useNotifications";
import { BaseResponse } from "@shared/types/http/base";

const useMarkAsReaded = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { setUnReadedNotificationsCount } = useNotifications();

  const markAsReaded = async (): Promise<void> => {
    setLoading(true);

    try {
      const res = await fetch("/api/notifications/markAsReaded", {
        method: "POST",
      });
      const data: BaseResponse = await res.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to mark notifications as read");
      }

      setUnReadedNotificationsCount(0);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return { loading, markAsReaded };
};

export default useMarkAsReaded;
