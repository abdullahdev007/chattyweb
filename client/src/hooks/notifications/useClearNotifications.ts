import { useState } from "react";
import toast from "react-hot-toast";
import { useNotifications } from "@/stores";
import { BaseResponse } from "@shared/types/http/base";

const useClearAllNotifications = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { setUnReadedNotificationsCount, setNotifications } =
    useNotifications();

  const clearAllNotifications = async (): Promise<void> => {
    setLoading(true);

    try {
      const res = await fetch("/api/notifications/clearAll", {
        method: "POST",
      });

      const data: BaseResponse = await res.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to clear notifications");
      }

      setUnReadedNotificationsCount(0);
      setNotifications([]);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return { loading, clearAllNotifications };
};

export default useClearAllNotifications;
