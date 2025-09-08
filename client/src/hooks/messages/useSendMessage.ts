import { useState } from "react";
import toast from "react-hot-toast";
import { useConversations, useConversation } from "@/stores";
import { SendMessageResponse } from "@shared/types/http";
import { ClientMessage } from "@/types/MessageTypes";

const useSendMessage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { messages, setMessages, selectedConversation } = useConversation();
  const { updateConversation } = useConversations();

  const sendMessage = async (
    message: string,
    replyTo?: string,
  ): Promise<boolean> => {
    setLoading(true);
    try {
      const requestBody: any = { message };

      if (replyTo) {
        requestBody.replayTo = replyTo;
      }

      const res = await fetch(
        `/api/messages/send/${selectedConversation!._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        },
      );
      const data: SendMessageResponse = await res.json();

      if (!data.success) throw new Error(data.message);

      if (data.conversation && data.newMessage) {
        updateConversation(data.conversation);
        setMessages([...messages, data.newMessage as ClientMessage]);
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
