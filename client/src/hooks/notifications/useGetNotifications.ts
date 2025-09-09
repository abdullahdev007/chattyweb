import {  useState } from "react";
import toast from "react-hot-toast";
import { useNotifications, useNotificationsPagination } from "@/stores";
import { GetNotificationsResponse } from "@shared/types/http/modules/notification";
import { SafeNotification } from "@shared/types/models/notification";

const useGetNotifications = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { setNotifications, notifications, setUnReadedNotificationsCount } =
    useNotifications();
  const {
    setLoading: setPaginationLoading,
    setPaginationData,
    setCurrentPage
  } = useNotificationsPagination();

  // Fetch notifications with pagination
  const fetchNotifications = async (page: number = 1) => {
    setLoading(true);
    setPaginationLoading(true);

    try {
      const res = await fetch(`/api/notifications?page=${page}`);
      const data: GetNotificationsResponse = await res.json();
      if (!data.success || !data.notifications) {
        throw new Error(data.message || "Failed to fetch notifications");
      }

      const unreadCount = data.notifications.filter(
        (not: SafeNotification) => !not.readed,
      ).length;
      setUnReadedNotificationsCount(unreadCount);
      setNotifications(data.notifications);

      // Set pagination data if available
      const pagination = data.pagination;
      if (
        pagination !== undefined
      ) {
        setPaginationData({
          total: pagination.total,
          page: pagination.page,
          totalPages: pagination.totalPages,
        });
        setCurrentPage(pagination.page);
      }
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
      setPaginationLoading(false);
    }
  };

  return { loading, notifications, fetchNotifications };
};

export default useGetNotifications;
