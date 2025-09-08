import { useState } from "react";
import toast from "react-hot-toast";
import { MarkMessagesAsReadedResponse } from "@shared/types/http";
import { useConversations } from "@/stores";

const useMarkMessagesAsReaded = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { updateConversation } = useConversations();

  const markMessagesAsReaded = async (conversationId: string) => {
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
          : "Error marking messages as readed",
      );
    } finally {
      setLoading(false);
    }
  };

  return { markMessagesAsReaded, loading };
};

export default useMarkMessagesAsReaded;
