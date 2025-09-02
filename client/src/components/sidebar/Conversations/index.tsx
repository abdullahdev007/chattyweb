import { useEffect, useState, FC } from "react";
import useGetConversations from "@/hooks/conversations/useFetchConversations";
import useSearchConversation from "@/stores/useSearchConversation";
import Conversation from "./Conversation";
import { FaUserPlus } from "react-icons/fa";
import { useAuthContext } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { Conversation as ConversationType } from "@shared/types/models/conversation";
import { useSidebarContext } from "@/context/sidebarContext";

const Conversations: FC = () => {
  const { loading, conversations } = useGetConversations();
  const [filtredConversations, setFiltredConversations] = useState<
    ConversationType[]
  >([]);
  const { searchConversation } = useSearchConversation();
  const { authUser } = useAuthContext();
  const { switchToInsights } = useSidebarContext();

  if (!authUser) return <Navigate to="/login" replace />;

  useEffect(() => {
    let filtered = conversations.filter((c) => {
      const participant = c.participants.find(
        (u) => u.userId._id !== authUser!._id
      );
      if (!participant) return false;

      return participant.userId.fullName
        .toLowerCase()
        .startsWith(searchConversation.toLowerCase());
    });

    filtered.sort((a, b) => {
      const aLatestMessage =
        a.messages && a.messages.length > 0
          ? a.messages[a.messages.length - 1]
          : null;
      const bLatestMessage =
        b.messages && b.messages.length > 0
          ? b.messages[b.messages.length - 1]
          : null;

      if (!aLatestMessage || !bLatestMessage) return 0;
      return (
        new Date(bLatestMessage.createdAt).getTime() -
        new Date(aLatestMessage.createdAt).getTime()
      );
    });

    setFiltredConversations(filtered);
  }, [authUser, conversations, searchConversation]);

  return (
    <div className="py-1 sm:py-2 text-content min-h-0 max-h-48 sm:max-h-none overflow-auto">
      {filtredConversations.length <= 0 && searchConversation.length > 0 ? (
        <div className="flex flex-col justify-center items-center break-words text-center p-2">
          <span className="text-xs sm:text-sm max-w-full px-2">
            No conversations with &quot;{searchConversation}&quot;
          </span>
        </div>
      ) : searchConversation.length === 0 &&
        filtredConversations.length <= 0 ? (
        <div className="break-words text-center w-full flex justify-center flex-col items-center gap-2 sm:gap-3 p-2">
          <span className="text-xs sm:text-sm max-w-full px-2">
            You don't have any friends yet. Start adding friends and chatting!
          </span>

          <button
            className="btn btn-accent btn-circle btn-outline btn-ghost btn-md"
            onClick={() => {
              const modal = document.getElementById(
                "add_friend_modal"
              ) as HTMLDialogElement;
              if (modal) modal.showModal();
            }}
          >
            <FaUserPlus className="text-lg" />
          </button>
        </div>
      ) : (
        <div className="space-y-1 sm:space-y-2">
          {filtredConversations.map((conversation, idx) => (
            <Conversation
              key={conversation._id.toString()}
              conversation={conversation}
              lastIdx={idx === filtredConversations.length - 1}
            />
          ))}
        </div>
      )}
      {loading ? (
        <div className="flex justify-center p-4">
          <span className="loading loading-spinner loading-sm"></span>
        </div>
      ) : null}
    </div>
  );
};

export default Conversations;
