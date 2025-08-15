import { BaseResponse } from "@shared/types/http";
import { useState } from "react";
import toast from "react-hot-toast";

const useSendFriendRequest = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const sendFriendRequest = async (friendId: string): Promise<void> => {
    setLoading(true);
    try {
      const res = await fetch(`/api/friends/send-request/${friendId}`, {
        method: "POST",
      });
      const data: BaseResponse = await res.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      if (data.message) {
        toast.success(data.message);
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to send friend request",
      );
    } finally {
      setLoading(false);
    }
  };

  return { sendFriendRequest, loading };
};

export default useSendFriendRequest;
