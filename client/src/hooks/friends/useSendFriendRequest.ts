import { useState } from "react";
import toast from "react-hot-toast";
import { SendFriendRequestResponse } from "@shared/types/http";

const useSendFriendRequest = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const sendFriendRequest = async (
    friendId: string,
  ): Promise<SendFriendRequestResponse | undefined> => {
    setLoading(true);
    try {
      const res = await fetch(`/api/friends/send-request/${friendId}`, {
        method: "POST",
      });
      const data: SendFriendRequestResponse = await res.json();

      if (!data.success) {
        throw new Error(data.error);
      }

      if (data.message) {
        toast.success(data.message);
      }
      return data;
    } catch (error) {
      console.error("Error sending friend request:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to send friend request",
      );
      return undefined;
    } finally {
      setLoading(false);
    }
  };

  return { sendFriendRequest, loading };
};

export default useSendFriendRequest;
