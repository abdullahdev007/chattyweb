import { useSocketContext } from "@/context/socketContext";
import useConversation from "@/stores/useConversation";
import useMarkMessagesAsReaded from "@/hooks/conversations/useMarkMessagesAsReaded";
import { useAuthContext } from "@/context/AuthContext";
import { useSidebarContext } from "@/context/sidebarContext";
import { FC } from "react";
import { Conversation as ConversationType } from "@shared/types/models/conversation";

interface ConversationProps {
  conversation: ConversationType;
  lastIdx: boolean;
}

const Conversation: FC<ConversationProps> = ({ conversation, lastIdx }) => {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const { markMessagesAsReaded } = useMarkMessagesAsReaded();
  const { onlineUsers } = useSocketContext();
  const { authUser } = useAuthContext();
  const { switchToInsights } = useSidebarContext();

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

  const isOnline = onlineUsers.includes(user._id.toString());

  return (
    <>
      <div
        className={`flex gap-1 sm:gap-2 items-center hover:bg-primary rounded p-1 sm:p-2 cursor-pointer overflow-hidden w-full transition-colors
      ${isSelected ? "bg-primary" : ""}`}
        onClick={() => {
          if (unReadCount > 0)
            markMessagesAsReaded(conversation._id.toString());
          setSelectedConversation(conversation);
          switchToInsights();
        }}
      >
        <div className={`avatar ${isOnline ? "online" : ""} flex-shrink-0`}>
          <div className="w-8 sm:w-10 md:w-12 rounded-full">
            <img
              src={user.profilePic}
              alt=" user avatar"
              className="w-full h-full object-cover"
              onError={(e: any) => {
                e.currentTarget.src = `/avatars/${user.gender}.png`;
              }}
            />
          </div>
        </div>

        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex gap-1 sm:gap-2 md:gap-3 justify-between items-center">
            <p className="font-bold text-base-content text-xs sm:text-sm md:text-base truncate">
              {user.fullName}
            </p>
            {unReadCount > 0 && (
              <div className="badge badge-error gap-1 text-white font-bold text-xs flex-shrink-0">
                {unReadCount}
              </div>
            )}
          </div>

          <div className="text-xs sm:text-sm opacity-70 truncate max-w-full">
            {conversation.latestMessage
              ? conversation.latestMessage.message
              : ""}
          </div>
        </div>
      </div>

    </>
  );
};

export default Conversation;
