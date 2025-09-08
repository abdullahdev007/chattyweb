import { useState } from "react";
import toast from "react-hot-toast";
import { useFriendRequests } from "@/stores";
import { BaseResponse, RespondFriendRequestBody } from "@shared/types/http";

const useResponseFriendRequest = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { removeFriendRequest } = useFriendRequests();

  const responseFriendRequest = async (
    friendId: string,
    response: RespondFriendRequestBody["response"],
  ): Promise<void> => {
    setLoading(true);
    try {
      const res = await fetch(`/api/friends/respond-request/${friendId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response }),
      });

      const data: BaseResponse = await res.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      if (data.message) {
        toast.success(data.message);
      }

      removeFriendRequest(friendId);
    } catch (error) {
      console.error("Error responding to friend request:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to respond to friend request",
      );
    } finally {
      setLoading(false);
    }
  };

  return { responseFriendRequest, loading };
};

export default useResponseFriendRequest;
