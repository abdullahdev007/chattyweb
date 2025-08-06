import { useState } from "react";
import toast from "react-hot-toast";
import { MarkMessagesAsReadedResponse } from "@shared/types/http";
import useConversations from "@/zustand/useConversations";

const useMarkMessagesAsRead = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { updateConversation } = useConversations();

  const markMessagesAsRead = async (conversationId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/conversations/read/${conversationId}`, {
        method: "PUT",
      });
      const data: MarkMessagesAsReadedResponse = await res.json();
      if (!data.success) throw new Error(data.message);

      if (data.conversation) updateConversation(data.conversation);
    } catch (error: any) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Error marking messages as read"
      );
    } finally {
      setLoading(false);
    }
  };

  return { markMessagesAsRead, loading };
};

export default useMarkMessagesAsRead;
