import { useEffect, useState, FC } from "react";
import useGetConversations from "@/hooks/conversations/useFetchConversations";
import useSearchConversation from "@/zustand/useSearchConversation";
import Conversation from "./Conversation";
import { FaUserPlus } from "react-icons/fa";
import { useAuthContext } from "@/context/AuthContext";
import { IConversation } from "@shared/types/models/conversation";
import { Navigate } from "react-router-dom";

const Conversations: FC = () => {
  const { loading, conversations } = useGetConversations();
  const [filtredConversations, setFiltredConversations] = useState<
    IConversation[]
  >([]);
  const { searchConversation } = useSearchConversation();
  const { authUser } = useAuthContext();

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
      if (!a.latestMessage || !b.latestMessage) return 0;
      return (
        new Date(b.latestMessage.createdAt).getTime() -
        new Date(a.latestMessage.createdAt).getTime()
      );
    });

    setFiltredConversations(filtered);
  }, [authUser, conversations, searchConversation]);

  return (
    <div className="py-2 flex flex-col">
      {filtredConversations.length <= 0 && searchConversation.length > 0 ? (
        <div className="flex flex-col justify-center items-center break-words text-center">
          <span className="max-w-52">
            There are no conversations with &quot;{searchConversation}&quot;
          </span>
        </div>
      ) : searchConversation.length === 0 &&
        filtredConversations.length <= 0 ? (
        <div className="break-words  text-center max-sm:w-full flex justify-center w-full flex-col items-center gap-3">
          <span className="max-w-52">
            You do not have any friends. Start adding friends and chatting with
            your friends
          </span>

          <button
            className="btn  btn-accent btn-circle btn-outline btn-ghost"
            onClick={() => {
              const modal = document.getElementById(
                "add_friend_modal"
              ) as HTMLDialogElement;
              if (modal) modal.showModal();
            }}
          >
            <FaUserPlus />
          </button>
        </div>
      ) : (
        filtredConversations.map((conversation, idx) => (
          <Conversation
            key={conversation._id.toString()}
            conversation={conversation}
            lastIdx={idx === filtredConversations.length - 1}
          />
        ))
      )}
      {loading ? (
        <span className="loading loading-spinner mx-auto my-auto"></span>
      ) : null}
    </div>
  );
};

export default Conversations;
