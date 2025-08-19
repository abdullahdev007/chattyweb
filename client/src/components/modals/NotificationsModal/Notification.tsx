import { FC } from "react";
import calculateNotificationTime from "@/utils/calculateNotificationTime";
import { NotificationTypes } from "@/types/NotificationTypes";
import useConversation from "@/zustand/useConversation";
import useFriends from "@/zustand/useFriends";
import useConversations from "@/zustand/useConversations";
import { useAuthContext } from "@/context/AuthContext";
import { SafeNotification } from "@shared/types/models/notification";

interface NotificationProps {
  notification: SafeNotification;
  lastIdx: boolean;
}

const Notification: FC<NotificationProps> = ({ notification, lastIdx }) => {
  const { setSelectedConversation } = useConversation();
  const { friends } = useFriends();
  const { conversations } = useConversations();
  const { authUser } = useAuthContext();

  const handleOnClick = () => {
    const notificationsModal = document.getElementById(
      "notifications_modal",
    ) as HTMLDialogElement;
    const requestsModal = document.getElementById(
      "pending_friendships_modal",
    ) as HTMLDialogElement;

    if (
      notification.type === NotificationTypes.NewFriendRequest &&
      notificationsModal &&
      requestsModal
    ) {
      notificationsModal.close();
      requestsModal.showModal();
    } else if (
      notification.type === NotificationTypes.FriendRequestAccepted &&
      friends.some((friend) => friend._id === notification.senderId._id) &&
      notificationsModal
    ) {
      notificationsModal.close();
      const conversation = conversations.find(
        (conv) =>
          conv.participants.some(
            (participant) =>
              participant.userId._id === notification.senderId._id,
          ) &&
          conv.participants.some(
            (participant) => participant.userId._id === authUser?._id,
          ),
      );

      if (conversation) {
        setSelectedConversation(conversation);
      }
    }

    console.log(notification.type);
  };

  return (
    <div
      onClick={handleOnClick}
      className="card bg-base-100 shadow-sm hover:shadow-md transition-all duration-200 border border-base-300 cursor-pointer hover:bg-base-200/50"
    >
      <div className="card-body p-4">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="avatar flex-shrink-0">
            <div className="w-10 h-10 rounded-full ring-2 ring-base-300">
              <img
                src={notification.senderId.profilePic}
                onError={(e) => {
                  e.currentTarget.src = `/avatars/${notification.senderId.gender}.png`;
                }}
                alt={`${notification.senderId.fullName} avatar`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-base-content text-sm leading-relaxed">
              {notification.message}
            </p>
            <p className="text-base-content/50 text-xs mt-2">
              {calculateNotificationTime(notification.createdAt.toString())}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;
