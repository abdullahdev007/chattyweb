import React from "react";
import { ClientMessage } from "@/types/MessageTypes";
import { FaReply } from "react-icons/fa";
import useAuthStore from "@/stores/core/useAuthStore";

interface ReplyIndicatorProps {
  message: ClientMessage;
  repliedMessage?: ClientMessage | null;
}

const ReplyIndicator: React.FC<ReplyIndicatorProps> = ({
  message,
  repliedMessage,
}) => {
  const { authUser } = useAuthStore();
  const truncateMessage = (
    text: string,
    maxLines: number = 2,
    maxCharsPerLine: number = 50
  ) => {
    if (!text) return "";

    const lines = text.split("\n");
    const totalChars = text.length;

    // If text is short enough, return as is
    if (totalChars <= maxCharsPerLine * maxLines) {
      return text;
    }

    // If we have more lines than maxLines, truncate
    if (lines.length > maxLines) {
      const truncatedLines = lines.slice(0, maxLines);
      const lastLine = truncatedLines[maxLines - 1];

      // If the last line is too long, truncate it
      if (lastLine.length > maxCharsPerLine) {
        truncatedLines[maxLines - 1] =
          lastLine.substring(0, maxCharsPerLine - 3) + "...";
      } else {
        truncatedLines[maxLines - 1] = lastLine + "...";
      }

      return truncatedLines.join("\n");
    }

    // If we have fewer lines but the text is still too long
    if (lines.length === 1 && text.length > maxCharsPerLine * maxLines) {
      return text.substring(0, maxCharsPerLine * maxLines - 3) + "...";
    }

    return text;
  };

  const replayToYourSelf = repliedMessage?.senderId._id === authUser?._id;

  return (
    <div
      className={`p-2 mb-2 rounded-lg text-xs border-l-4 shadow-sm ${"bg-accent/30 border-accent/70 text-base-content"}`}
    >
      <div className="flex items-center mb-1 gap-1   rounded-md p-1">
        <div className="">
          <FaReply />
        </div>
        <span className="">
          Reply To{" "}
          <span className="font-semibold">
            {replayToYourSelf ? "Yourself" : repliedMessage?.senderId.fullName}
          </span>
        </span>
      </div>

      {/* Replied message content */}
      <div className={`text-xs opacity-40 font-medium`}>
        {repliedMessage ? (
          <div className="whitespace-pre-line max-h-8 overflow-hidden">
            {truncateMessage(repliedMessage.message)}
          </div>
        ) : (
          <div className="italic opacity-60">Message not found</div>
        )}
      </div>
    </div>
  );
};

export default ReplyIndicator;
