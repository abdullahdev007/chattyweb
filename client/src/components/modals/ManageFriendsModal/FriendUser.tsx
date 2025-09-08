import { FC } from "react";
import { useSocketContext } from "@/context/socketContext";
import { IoPersonRemoveSharp } from "react-icons/io5";
import { IoMdChatbubbles } from "react-icons/io";
import { useConversation, useConversations } from "@/stores";
import useRemoveFriend from "@/hooks/friends/useRemoveFriend";
import { useAuthContext } from "@/context/AuthContext";
import { SafeUser } from "@shared/types/models/user";
import { Conversation } from "@shared/types/models/conversation";

interface FriendUserProps {
  friend: SafeUser;
  lastIdx: boolean;
}

const FriendUser: FC<FriendUserProps> = ({ friend, lastIdx }) => {
  const { onlineUsers } = useSocketContext();

  const { setSelectedConversation } = useConversation();
  const { conversations } = useConversations();
  const { removeFriend, loading } = useRemoveFriend();
  const { authUser } = useAuthContext();

  const isOnline = onlineUsers.includes(friend._id.toString());

  function findConversationWithFriendAndAuthUser(): Conversation | null {
    for (const conversation of conversations) {
      const participants = conversation.participants;

      if (
        participants.some(
          (participant) => participant.userId._id === friend._id,
        ) &&
        participants.some(
          (participant) => participant.userId._id === authUser?._id,
        )
      ) {
        return conversation;
      }
    }

    return null;
  }

  return (
    <div className="card bg-base-100 shadow-sm hover:shadow-md transition-all duration-200 border border-base-300">
      <div className="card-body p-4">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="avatar flex-shrink-0">
            <div
              className={`w-12 h-12 rounded-full ring-2 ${isOnline ? "ring-success" : "ring-base-300"}`}
            >
              <img
                src={friend.profilePic}
                onError={(e) => {
                  e.currentTarget.src = `/avatars/${friend.gender}.png`;
                }}
                alt={`${friend.fullName} avatar`}
                className="w-full h-full object-cover"
              />
            </div>
            {isOnline && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-base-100"></div>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base-content text-lg truncate">
              {friend.fullName}
            </h3>
            <p className="text-base-content/60 text-sm truncate">
              @{friend.username}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 flex-shrink-0">
            <form method="dialog">
              <button
                className="btn btn-circle btn-outline btn-secondary hover:btn-primary transition-all duration-200"
                onClick={() => {
                  setSelectedConversation(
                    findConversationWithFriendAndAuthUser(),
                  );
                }}
                title="Start chat"
              >
                <IoMdChatbubbles className="text-lg" />
              </button>
            </form>

            <button
              className="btn btn-circle btn-outline btn-error hover:btn-error transition-all duration-200"
              onClick={() => {
                removeFriend(friend._id.toString());
              }}
              disabled={loading}
              title="Remove friend"
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <IoPersonRemoveSharp className="text-lg" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendUser;
