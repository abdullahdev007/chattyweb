import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { GetConversationsResponse } from "@shared/types/http";
import { IConversation } from "@shared/types/models/conversation";
import useConversation from "@/zustand/useConversation";
import useFriends from "@/zustand/useFriends";

const useGetConversations = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const { selectedConversation, setSelectedConversation } = useConversation();
	const { friends } = useFriends();

  const getConversations = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/conversations");
      const data: GetConversationsResponse = await res.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      setConversations(data.conversations ?? []);

      if (selectedConversation) {
        if (
          conversations.find((conv) => conv._id == selectedConversation._id) == undefined
        ) {
          setSelectedConversation(null);
        }
      }

    } catch (error: any) {
      toast.error(
        error instanceof Error ? error.message : "Error fetching conversations"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getConversations();
  }, [friends]);

  return { conversations, loading, getConversations };
};

export default useGetConversations;
