import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";
import useConversations from "../zustand/useConversations";
import { SendMessageResponse } from "@shared/types/http";
import { IMessage } from "@shared/types/models/message";

const useSendMessage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { messages, setMessages, selectedConversation } = useConversation();
  const { updateConversation } = useConversations();

  const sendMessage = async (message: string): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/messages/send/${selectedConversation!._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message }),
        },
      );
      const data: SendMessageResponse = await res.json();

      if (!data.success) throw new Error(data.message);

      if (data.conversation && data.newMessage) {
        updateConversation(data.conversation);
        setMessages([...messages, data.newMessage]);
      }

      return true;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error fetching conversations",
      );

      return false;
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, loading };
};
export default useSendMessage;
