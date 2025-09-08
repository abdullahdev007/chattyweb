import { FC, useEffect } from "react";
import useClearAllNotifications from "@/hooks/notifications/useClearNotifications";
import useGetNotifications from "@/hooks/notifications/useGetNotifications";
import Notification from "./Notification";
import { useNotifications, useNotificationsPagination } from "@/stores";
import useMarkAsReaded from "@/hooks/notifications/useMarkAsReaded";
import Pagination from "@/components/ui/Pagination";
import { FaBell, FaTrash, FaBellSlash } from "react-icons/fa";

const NotificationsModal: FC = () => {
  const { notifications, fetchNotifications } = useGetNotifications();
  const { clearAllNotifications } = useClearAllNotifications();
  const { unReadedNotificationsCount } = useNotifications();
  const { markAsReaded } = useMarkAsReaded();
  const { currentPage, totalPages, total, isLoading, setCurrentPage } =
    useNotificationsPagination();

  // Initialize data when modal opens
  useEffect(() => {
    fetchNotifications(1);
  }, []);

  useEffect(() => {
    const modal = document.getElementById(
      "notifications_modal"
    ) as HTMLDialogElement;
    if (modal?.open && notifications.length > 0) {
      markAsReaded();
    }
  }, [notifications.length, unReadedNotificationsCount, markAsReaded]);

  // Handle page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchNotifications(page);
  };

  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <dialog
      id="notifications_modal"
      className="modal modal-bottom sm:modal-middle z-20"
    >
      <div className="modal-box w-full max-w-2xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-xl text-base-content flex items-center gap-2">
            <FaBell className="text-accent" />
            Notifications
            {unReadedNotificationsCount > 0 && (
              <div className="badge badge-accent badge-sm">
                {unReadedNotificationsCount}
              </div>
            )}
          </h3>
          <div className="flex items-center gap-2">
            {notifications.length > 0 && (
              <button
                className="btn btn-sm btn-ghost text-error hover:bg-error hover:text-error-content"
                onClick={() => clearAllNotifications()}
                title="Clear all notifications"
              >
                <FaTrash className="text-sm" />
              </button>
            )}
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost">✕</button>
            </form>
          </div>
        </div>

        <div className="divider my-4"></div>

        {/* Content */}
        <div className="flex flex-col">
          <div className="flex-1 overflow-y-auto max-h-[50vh]">
            {isLoading ? (
              <div className="text-center py-8">
                <span className="loading loading-spinner loading-lg text-primary"></span>
                <p className="text-base-content/70 font-medium mt-4">
                  Loading notifications...
                </p>
              </div>
            ) : notifications.length > 0 ? (
              <div className="space-y-2">
                {sortedNotifications.map((notification, index) => (
                  <Notification
                    key={notification._id.toString()}
                    lastIdx={index === notifications.length - 1}
                    notification={notification}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FaBellSlash className="text-6xl text-base-content/20 mx-auto mb-4" />
                <p className="text-base-content/70 font-medium">
                  No notifications yet
                </p>
                <p className="text-base-content/50 text-sm mt-2">
                  You'll see notifications here when you receive friend requests
                  or messages
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="divider my-2"></div>

        {/* Pagination */}
        {!isLoading && notifications.length > 0 && totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              isLoading={isLoading}
            />
        )}
      </div>

      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default NotificationsModal;
