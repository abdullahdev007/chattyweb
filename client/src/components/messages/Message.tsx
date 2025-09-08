import { useAuthContext } from "@/context/AuthContext";
import { useConversation } from "@/stores";
import { extractTime } from "@/utils/extractTime";
import React, { useRef } from "react";
import { ClientMessage } from "@/types/MessageTypes";
import ReplyIndicator from "./ReplyIndicator";
import useDoubleClick from "@/hooks/ui/useDoubleClick";

interface MessageProps {
  message: ClientMessage;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const { authUser } = useAuthContext();
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
        className={`chat-bubble text-base-content ${fromMe ? "chat-bubble-primary" : ""} ${message.shouldShake ? "shake" : ""} pb-2 max-w-[80%] sm:max-w-[70%] lg:max-w-[60%] text-sm sm:text-base cursor-pointer select-none transition-all duration-200 ${
          isPressed ? "animate-shake" : ""
        }`}
      >
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
