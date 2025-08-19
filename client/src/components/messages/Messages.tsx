import { useEffect, useRef } from "react";
import useGetMessages from "../../hooks/useGetMessages";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import Message from "./Message";
import React from "react";

const Messages: React.FC = () => {
  const { messages, loading } = useGetMessages();
  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages]);

  return (
    <div className="px-4 flex-1 overflow-y-auto min-h-0">
      {!loading &&
        messages.length > 0 &&
        messages.map((message: any) => (
          <div key={message._id} ref={lastMessageRef} className="mb-4">
            <Message message={message} />
          </div>
        ))}
      {loading && [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)}
      {!loading && messages.length === 0 && (
        <div className="flex items-center justify-center h-full min-h-[200px]">
          <p className="text-center text-base-content/70">
            Send a message to start conversation
          </p>
        </div>
      )}
    </div>
  );
};

export default Messages;
