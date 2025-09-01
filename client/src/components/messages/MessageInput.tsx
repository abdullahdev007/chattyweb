import useSendMessage from "../../hooks/messages/useSendMessage";
import { useState, useRef, useEffect } from "react";
import React from "react";
import { FaPaperPlane } from "react-icons/fa";
import ReplyPreview from "./ReplyPreview";
import useConversation from "@/stores/useConversation";

const MessageInput: React.FC = () => {
  const { loading, sendMessage } = useSendMessage();
  const { replyToMessage, clearReplyToMessage } = useConversation();
  const [message, setMessage] = useState<string>("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Refocus textarea after message is sent
  useEffect(() => {
    if (!loading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [loading]);

  const handleSubmit = async () => {
    if (!message.trim() || loading) return;

    // Send message with reply ID if available
    const success = await sendMessage(
      message.trim(),
      replyToMessage?._id.toString()
    );

    if (!success) return;

    setMessage("");
    clearReplyToMessage(); // Clear reply after sending

    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
  };

  return (
    <div className="px-4 my-3">
      {/* Reply Preview */}
      <ReplyPreview />

      <div
        className={`w-full relative transition-all duration-300 ${loading ? "opacity-60" : ""}`}
      >
        {/* Main input container with cool focus effects */}
        <div
          className={`
            relative flex items-end gap-2 p-3 rounded-2xl border-2 transition-all duration-300
            ${
              isFocused
                ? "border-primary shadow-lg shadow-primary/20 bg-base-100"
                : "border-base-300 bg-base-200 hover:border-base-content/30 hover:shadow-md"
            }
            ${loading ? "pointer-events-none" : ""}
          `}
        >
          {/* Textarea */}
          <textarea
            ref={inputRef}
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={
              replyToMessage ? "Reply to message..." : "Send a message..."
            }
            className="
              flex-1 min-h-[40px] max-h-[120px] resize-none
              bg-transparent border-none outline-none
              text-base-content placeholder-base-content/50
              font-['Chakra_Petch'] text-base
              focus:outline-none focus:ring-0
              transition-all duration-200
            "
            style={{
              fontFamily: "'Chakra Petch', sans-serif",
              lineHeight: "1.5",
            }}
            maxLength={1000}
            disabled={loading}
          />

          {/* Send button */}
          <button
            onClick={handleSubmit}
            disabled={!message.trim() || loading}
            className={`
              btn btn-circle btn-sm transition-all duration-200
              ${
                message.trim() && !loading
                  ? "btn-primary hover:scale-105 active:scale-95 shadow-lg shadow-primary/30 hover:shadow-xl"
                  : "btn-ghost text-base-content/40 hover:bg-base-200"
              }
              focus:ring-2 focus:ring-secondary focus:ring-opacity-50
            `}
            title="Send message"
          >
            <FaPaperPlane
              className={`w-3 h-3 transition-transform duration-200 ${message.trim() && !loading ? "hover:translate-x-0.5" : ""}`}
            />
          </button>

          {/* Loading spinner overlay */}
          {loading && (
            <div className="absolute inset-0 bg-base-200/50 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <div className="loading loading-spinner loading-sm text-primary"></div>
            </div>
          )}
        </div>

        {/* Cool focus indicator with gradient */}
        {isFocused && (
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 animate-pulse pointer-events-none"></div>
        )}

        {/* Focus ring effect */}
        {isFocused && (
          <div className="absolute inset-0 rounded-2xl ring-2 ring-primary/20 ring-offset-2 ring-offset-base-100 pointer-events-none"></div>
        )}
      </div>
    </div>
  );
};

export default MessageInput;
