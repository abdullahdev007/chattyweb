import { useState } from "react";
import toast from "react-hot-toast";
import useFriends from "../../zustand/useFriends";
import { BaseResponse, DeleteFriendRequestParams } from "@shared/types/http";
import useConversation from "@/zustand/useConversation";
import useConversations from "@/zustand/useConversations";
import { IConversation } from "@shared/types/models/conversation";

const useRemoveFriend = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { removeFriend: deleteFriend } = useFriends();

  const removeFriend = async (
    friendId: DeleteFriendRequestParams["id"],
  ): Promise<void> => {
    setLoading(true);
    try {
      const res = await fetch(`/api/friends/delete-friend/${friendId}`, {
        method: "DELETE",
      });

      const data: BaseResponse = await res.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      deleteFriend(friendId);

      if (data.message) {
        toast.success(data.message);
      }
    } catch (error) {
      console.error("Error removing friend:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to remove friend",
      );
    } finally {
      setLoading(false);
    }
  };

  return { removeFriend, loading };
};

export default useRemoveFriend;
