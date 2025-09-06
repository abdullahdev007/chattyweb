import { FC } from "react";
import { Toast } from "react-hot-toast";
import { useConversation, useConversations } from "@/stores";
import { useAuthContext } from "../../context/AuthContext";
import useMarkMessagesAsReaded from "../../hooks/conversations/useMarkMessagesAsReaded";
import { FaMessage } from "react-icons/fa6";
import { ClientMessage } from "@/types/MessageTypes";
import { Conversation } from "@shared/types/models/conversation";

interface NewMessageNotificationProps {
  t: Toast;
  newMessage: ClientMessage;
}

const NewMessageNotification: FC<NewMessageNotificationProps> = ({
  t,
  newMessage,
}) => {
  const { setSelectedConversation } = useConversation();
  const { conversations } = useConversations();
  const { authUser } = useAuthContext();
  const { markMessagesAsReaded } = useMarkMessagesAsReaded();

  return (
    <div
      className={`${
        t.visible ? "animate-enter" : "animate-leave"
      } max-w-md w-full bg-base-100 shadow-xl rounded-xl pointer-events-auto flex ring-1 ring-base-300 cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-base-300`}
      onClick={() => {
        const conversation = conversations.find(
          (conv: Conversation) =>
            conv.participants.some(
              (participant) =>
                participant.userId._id === newMessage.senderId._id
            ) &&
            conv.participants.some(
              (participant) => participant.userId._id === authUser?._id
            )
        );

        if (!conversation) return;

        const currentUserObject = conversation.participants.find(
          (u) => u.userId._id === authUser?._id
        );

        if (!currentUserObject) return;

        const unReadCount = currentUserObject.unreadCount;
        if (unReadCount > 0) markMessagesAsReaded(conversation._id.toString());

        setSelectedConversation(conversation);
      }}
    >
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="avatar flex-shrink-0">
            <div className="w-12 h-12 rounded-full ring-2 ring-primary/20">
              <img
                className="w-full h-full object-cover"
                src={newMessage.senderId.profilePic}
                onError={(e) => {
                  e.currentTarget.src = `/avatars/${newMessage.senderId.gender}.png`;
                }}
                alt={`${newMessage.senderId.fullName} avatar`}
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <FaMessage className="text-primary text-sm" />
              <p className="text-sm font-bold text-base-content">
                {newMessage.senderId.fullName}
              </p>
            </div>
            <p className="text-sm text-base-content/70 line-clamp-2 leading-relaxed">
              {newMessage.message}
            </p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="flex border-l border-base-300"></div>
    </div>
  );
};

export default NewMessageNotification;
