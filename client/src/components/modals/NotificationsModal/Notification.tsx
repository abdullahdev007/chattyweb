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
    <div onClick={handleOnClick}>
      <div
        className={`flex justify-between my-4 hover:scale-105 transition-transform rounded-full 
        cursor-pointer items-center max-xs:flex-col max-xs:text-center gap-y-3`}
      >
        <div className="flex gap-2 items-center w-fit max-xs:flex-col">
          <div className="avatar ">
            <div className="w-12 rounded-full">
              <img
                src={notification.senderId.profilePic}
                onError={(e) => {
                  e.currentTarget.src = `/avatars/${notification.senderId.gender}.png`;
                }}
                alt="Avatar"
              />
            </div>
          </div>

          <div className="message w-fit">{notification.message}</div>
        </div>

        <div className="date text-xs text-gray-600 min-w-max">
          {calculateNotificationTime(notification.createdAt.toString())}
        </div>
      </div>

      {!lastIdx && <div className="divider my-0 py-0 h-1" />}
    </div>
  );
};

export default Notification;
