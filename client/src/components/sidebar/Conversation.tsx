import { useSocketContext } from "@/context/socketContext";
import useConversation from "@/zustand/useConversation";
import useMarkMessagesAsReaded from "@/hooks/conversations/useMarkMessagesAsReaded";
import { useAuthContext } from "@/context/AuthContext";
import { IConversation } from "@shared/types/models/conversation";
import { FC } from "react";

interface ConversationProps {
  conversation: IConversation;
  lastIdx: boolean;
}

const Conversation: FC<ConversationProps> = ({ conversation, lastIdx }) => {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const { markMessagesAsReaded } = useMarkMessagesAsReaded();
  const { onlineUsers } = useSocketContext();
  const { authUser } = useAuthContext();

  const userObject = conversation.participants.find(
    (u) => u.userId._id !== authUser?._id
  );

  const currentUserObject = conversation.participants.find(
    (u) => u.userId._id === authUser?._id
  );

  if (!userObject || !currentUserObject) {
    return null;
  }

  const user = userObject.userId;
  const unReadCount = currentUserObject.unreadCount;

  const isSelected = selectedConversation?._id === conversation._id;

  const isOnline = onlineUsers.includes(user._id);

  return (
    <>
      <div
        className={`flex gap-2 items-center hover:bg-primary rounded p-2 cursor-pointer overflow-hidden w-full
      ${isSelected ? "bg-primary" : ""}`}
        onClick={() => {
          if (unReadCount > 0) markMessagesAsReaded(conversation._id);
          setSelectedConversation(conversation);
        }}
      >
        <div className={`avatar ${isOnline ? "online" : ""} flex-shrink-0`}>
          <div className="w-10 sm:w-12 rounded-full">
            <img
              src={user.profilePic}
              alt=" user avatar"
              onError={(e: any) => {
                e.currentTarget.src = `/avatars/${user.gender}.png`;
              }}
            />
          </div>
        </div>

        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex gap-3 justify-between items-center">
            <p className="font-bold text-base-content text-sm sm:text-base truncate">
              {user.fullName}
            </p>
            {unReadCount > 0 && (
              <div className="badge badge-error gap-2 text-white font-bold text-xs flex-shrink-0">
                {unReadCount}
              </div>
            )}
          </div>

          <div className="text-xs sm:text-sm opacity-70 truncate sm:max-w-[200px]">
            {conversation.latestMessage
              ? conversation.latestMessage.message
              : ""}
          </div>
        </div>
      </div>

      {!lastIdx && <div className="divider my-0 py-0 h-1" />}
    </>
  );
};

export default Conversation;
