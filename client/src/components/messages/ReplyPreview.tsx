import React from "react";
import { FaReply, FaTimes } from "react-icons/fa";
import useConversation from "@/stores/useConversation";
import { useAuthContext } from "@/context/AuthContext";

const ReplyPreview: React.FC = () => {
  const { replyToMessage, clearReplyToMessage } = useConversation();
  const { authUser } = useAuthContext();

  if (!replyToMessage) return null;

  const fromMe = replyToMessage.senderId._id === authUser?._id;

  const truncateMessage = (text: string, maxLength: number = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="bg-accent/30 border-accent/70 text-base-content border-l-4  p-3 rounded-lg mb-2">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="flex-shrink-0">
            <FaReply className="w-3 h-3 text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-base-content">
              Replying to{" "}
              <span className="font-semibold">
                {fromMe ? "Yourself" : replyToMessage.senderId.fullName}
              </span>
            </div>
            <div className="text-xs text-base-content/70 truncate">
              {truncateMessage(replyToMessage.message)}
            </div>
          </div>
        </div>
        <button
          onClick={clearReplyToMessage}
          className="flex-shrink-0 p-1 hover:bg-base-300 rounded-full transition-colors"
        >
          <FaTimes className="w-3 h-3 text-base-content/60" />
        </button>
      </div>
    </div>
  );
};

export default ReplyPreview;
