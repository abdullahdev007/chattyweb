import { useState } from "react";
import toast from "react-hot-toast";
import useConversations from "@/stores/useConversations";
import { IncreaseUnReadCountResponse } from "@shared/types/http";

const useIncreaseUnreadCount = () => {
  const [loading, setLoading] = useState(false);
  const { updateConversation } = useConversations();

  const increaseUnreadCount = async (conversationID: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/messages/increaseUnreadCount/${conversationID}`,
        {
          method: "PUT",
        }
      );
      const data: IncreaseUnReadCountResponse = await res.json();

      if (!data.success) throw new Error(data.message);

      if (data.conversation) updateConversation(data.conversation);
    } catch (error: any) {
      toast.error(
        error instanceof Error ? error.message : "Error fetching conversations"
      );
    } finally {
      setLoading(false);
    }
  };

  return { loading, increaseUnreadCount };
};

export default useIncreaseUnreadCount;
