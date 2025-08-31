import { useAuthContext } from "@/context/AuthContext";
import useConversation from "@/zustand/useConversation";
import { extractTime } from "@/utils/extractTime";
import React from "react";
import { Gender } from "@shared/types/types";
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

  const fromMe = message.senderId._id === authUser?._id;
  const formattedTime = extractTime(message.createdAt.toString());
  const profilePic = fromMe
    ? authUser?.profilePic
    : selectedConversation?.participants.find(
        (p: any) => p.userId._id != authUser?._id,
      )!.userId.profilePic;
  const bubbleBgColor = fromMe ? "chat-bubble-primary" : "";
  const shakeClass = message.shouldShake ? "shake" : "";
  const gender: Gender = fromMe ? authUser?.gender : message.senderId.gender;

  // Check if this message is a reply
  const isReply = message.replayTo !== null;

  // Find the replied message from the conversation messages
  const repliedMessage = isReply
    ? messages.find(
        (msg: ClientMessage) =>
          msg._id.toString() === message.replayTo?.toString(),
      )
    : null;

  // Handle double click
  const handleDoubleClick = () => {
    setReplyToMessage(message);
  };

  // Use the enhanced double click hook with timing state
  const { handleClick, isPressed } = useDoubleClick({
    onDoubleClick: handleDoubleClick,
    activeDuration: 1000,
  });

  return (
    <div
      className={`chat ${fromMe ? "chat-end" : "chat-start"} break-words relative`}
      onClick={handleClick}
    >
      <div className="chat-image avatar">
        <div className="w-8 sm:w-10 rounded-full">
          <img
            alt="Tailwind CSS chat bubble component"
            src={profilePic}
            onError={(e) => {
              e.currentTarget.src = `/avatars/${gender}.png`;
            }}
          />
        </div>
      </div>

      <div className="chat-header text-xs flex items-center justify-between gap-2 opacity-70">
        {message.senderId.fullName}
        <time className=" opacity-70">{formattedTime}</time>
      </div>

      {/* Message bubble with swipe interactions */}
      <div
        className={`chat-bubble text-base-content ${bubbleBgColor} ${shakeClass} pb-2 max-w-[80%] sm:max-w-[70%] lg:max-w-[60%] text-sm sm:text-base cursor-pointer select-none transition-all duration-200 ${
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
