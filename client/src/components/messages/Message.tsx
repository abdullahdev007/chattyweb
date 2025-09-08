import useAuthStore from "@/stores/core/useAuthStore";
import { useConversation } from "@/stores";
import { extractTime } from "@/utils/extractTime";
import React, { useRef } from "react";
import { ClientMessage } from "@/types/MessageTypes";
import ReplyIndicator from "./ReplyIndicator";
import useDoubleClick from "@/hooks/ui/useDoubleClick";
import { FaReply } from "react-icons/fa";

interface MessageProps {
  message: ClientMessage;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const { authUser } = useAuthStore();
  const { selectedConversation, messages, setReplyToMessage } =
    useConversation();
  const messageRef = useRef<HTMLDivElement>(null);

  const sender =
    message.senderId._id === authUser?._id
      ? message.senderId
      : selectedConversation?.participants.find(
          (p: any) => p.userId._id != authUser?._id
        )?.userId;
  const fromMe = message.senderId._id === authUser?._id;

  // Check if this message is a reply and get the replied message
  const isReply = message.replayTo !== null;
  const repliedMessage = isReply
    ? messages.find(
        (msg: ClientMessage) =>
          msg._id.toString() === message.replayTo?.toString()
      )
    : null;

  // Use the enhanced double click hook with timing state
  const { handleClick, isPressed } = useDoubleClick({
    onDoubleClick: () => setReplyToMessage(message),
    activeDuration: 1000,
  });

  if (!sender) return null;
  return (
    <div
      className={`chat ${fromMe ? "chat-end" : "chat-start"} break-words relative`}
      ref={messageRef}
      onClick={handleClick}
    >
      <div className="chat-image avatar">
        <div className="w-8 sm:w-10 rounded-full">
          <img
            alt="Tailwind CSS chat bubble component"
            src={sender.profilePic}
            onError={(e) => {
              e.currentTarget.src = `/avatars/${sender.gender}.png`;
            }}
          />
        </div>
      </div>

      <div className="chat-header text-xs flex items-center justify-between gap-2 opacity-70">
        {message.senderId.fullName}
        <time className=" opacity-70">
          {extractTime(message.createdAt.toString())}
        </time>
      </div>

      {/* Message bubble with swipe interactions */}
      <div
        className={`chat-bubble text-base-content ${fromMe ? "chat-bubble-primary" : ""} ${message.shouldShake ? "shake" : ""} pb-2 max-w-[80%] sm:max-w-[70%] lg:max-w-[60%] text-sm sm:text-base cursor-pointer select-none transition-all duration-200 group relative ${
          isPressed ? "animate-shake" : ""
        }`}
      >
        {/* Reply button - appears on hover */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering the double-click handler
            setReplyToMessage(message);
          }}
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity
          duration-200 p-1.5 rounded-full bg-base-100/80 hover:bg-base-200/80 shadow-sm border border-base-300 z-10"
          title="Reply to this message"
        >
          <FaReply className="w-3 h-3 text-accent/70 hover:text-accent" />
        </button>

        {/* Reply indicator */}
        {isReply && (
          <ReplyIndicator message={message} repliedMessage={repliedMessage} />
        )}

        {/* Message content */}
        <div className="whitespace-normal leading-relaxed">
          {message.message}
        </div>
      </div>
    </div>
  );
};

export default Message;
