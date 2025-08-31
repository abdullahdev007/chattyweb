import { GetUnreadCountResponse } from "@shared/types/http";
import { Conversation } from "@shared/types/models/conversation";
import { useState } from "react";
import toast from "react-hot-toast";

const useGetUnReadedMessageCount = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const getUnReadedMessageCount = async (conversation: Conversation) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/messages/unreadCount/${conversation._id}`);
      const data: GetUnreadCountResponse = await res.json();

      if (!data.success) throw new Error(data.message);

      return data.unreadCount;
    } catch (error: any) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Error fetching un readed message count",
      );
    } finally {
      setLoading(false);
    }
  };

  return { loading, getUnReadedMessageCount };
};

export default useGetUnReadedMessageCount;
