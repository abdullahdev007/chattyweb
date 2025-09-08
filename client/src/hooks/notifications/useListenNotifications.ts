import { useEffect } from "react";
import { useSocketContext } from "../../context/socketContext";
import { useNotifications } from "@/stores";
import { NewNotificationPayload } from "@shared/types/socket";

const useListenNotifications = (): void => {
  const { socket } = useSocketContext();
  const { addNotification, addUnReadedNotificationsCount } = useNotifications();

  useEffect(() => {
    socket?.on(
      "newNotification",
      ({ notification }: NewNotificationPayload) => {
        addNotification(notification);
        addUnReadedNotificationsCount();
      },
    );
    return () => {
      socket?.off("newNotification");
    };
  }, [addNotification, addUnReadedNotificationsCount, socket]);
};

export default useListenNotifications;
