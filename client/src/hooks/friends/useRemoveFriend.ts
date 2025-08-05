import { useState } from "react";
import toast from "react-hot-toast";
import useFriends from "../../zustand/useFriends";
import { DeleteFriendRequestParams } from "@shared/types/http";

interface DeleteFriendResponse {
  success: boolean;
  message?: string;
  error?: string;
}

const useRemoveFriend = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { removeFriend: deleteFriend } = useFriends();

  const removeFriend = async (
    friendId: DeleteFriendRequestParams["id"],
  ): Promise<DeleteFriendResponse | undefined> => {
    setLoading(true);
    try {
      const res = await fetch(`/api/friends/delete-friend/${friendId}`, {
        method: "DELETE",
      });

      const data: DeleteFriendResponse = await res.json();

      if (!data.success) {
        throw new Error(data.error);
      }

      if (data.message) {
        toast.success(data.message);
      }

      deleteFriend(friendId);
      return data;
    } catch (error) {
      console.error("Error removing friend:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to remove friend",
      );
      return undefined;
    } finally {
      setLoading(false);
    }
  };

  return { removeFriend, loading };
};

export default useRemoveFriend;
