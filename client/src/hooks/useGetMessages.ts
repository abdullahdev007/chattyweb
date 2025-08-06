import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";
import { IMessage } from "@shared/types/models/message";

const useGetMessages = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { messages, setMessages, selectedConversation } = useConversation();

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/messages/${selectedConversation?._id}`);
        const data: { messages: IMessage[] } = await res.json();
        if (!data.messages) throw new Error("Failed to fetch messages");
        setMessages(data.messages);
      } catch (error: any) {
        toast.error(
          error instanceof Error ? error.message : "Error fetching messages"
        );
      } finally {
        setLoading(false);
      }
    };

    if (selectedConversation?._id) getMessages();
  }, [selectedConversation?._id, setMessages]);

  return { messages, loading };
};

export default useGetMessages;
