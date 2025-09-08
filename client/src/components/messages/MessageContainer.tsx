import { useEffect } from "react";
import { useConversation } from "@/stores";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import { TiMessages } from "react-icons/ti";
import useAuthStore from "@/stores/core/useAuthStore";
import React from "react";

const MessageContainer: React.FC = () => {
  const { selectedConversation, setSelectedConversation } = useConversation();
  useEffect(() => {
    return () => setSelectedConversation(null);
  }, [setSelectedConversation]);
  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      {!selectedConversation ? (
        <NoChatSelected />
      ) : (
        <>
          {/* Header */}
          <div className="px-4 py-2 mb-2 border-b border-base-content border-opacity-20 flex-shrink-0 ">
            <span className="text-base-content">To:</span>{" "}
            <span className="text-primary font-bold">
              {selectedConversation.participants[0].userId.fullName}
            </span>
          </div>
          <Messages />
          <MessageInput />
        </>
      )}
    </div>
  );
};

export default MessageContainer;

const NoChatSelected: React.FC = () => {
  const { authUser } = useAuthStore();

  return (
    <div className="flex items-center justify-center w-full h-full min-h-[400px]">
      <div className="px-4 text-center text-lg sm:text-xl md:text-2xl font-semibold flex flex-col items-center gap-4">
        <p>
          Welcome ✋{" "}
          <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent font-bold bg-[length:200%_100%] animate-[gradient_3s_ease-in-out_infinite]">
            {authUser?.fullName}
          </span>
        </p>
        <p className="text-base sm:text-lg">Select a chat to start messaging</p>
        <TiMessages className="text-4xl sm:text-5xl md:text-6xl text-primary" />
      </div>
    </div>
  );
};
