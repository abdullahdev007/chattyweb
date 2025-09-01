import { useState } from "react";
import { IncreaseUnReadCountResponse } from "@shared/types/http";

const useIncreaseUnreadCount = () => {
  const [loading, setLoading] = useState(false);

  const increaseUnreadCount = async (conversationID: string) => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/conversations/increaseUnreadCount/${conversationID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) throw new Error("Failed to increase unread count");

      const data: IncreaseUnReadCountResponse = await res.json();
      return data;
    } catch (error) {
      console.error("Error increasing unread count:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { loading, increaseUnreadCount };
};

export default useIncreaseUnreadCount;
