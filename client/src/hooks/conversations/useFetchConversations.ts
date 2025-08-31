import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { GetConversationsResponse } from "@shared/types/http";
import { Conversation } from "@shared/types/models/conversation";
import useConversation from "@/zustand/useConversation";
import useFriends from "@/zustand/useFriends";
import useConversations from "@/zustand/useConversations";

const useGetConversations = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { conversations, setConversations } = useConversations();
  const { selectedConversation, setSelectedConversation } = useConversation();
  const { friends } = useFriends();

  const fetchConversations = async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await fetch("/api/conversations");
      const data: GetConversationsResponse = await res.json();
      if (!data.success) throw new Error(data.message);

      if (data.conversations) {
        setConversations(data.conversations);

        //if selected conversation is not in conversations, close it
        if (
          selectedConversation &&
          !data.conversations!.find(
            (conv: Conversation) => conv._id == selectedConversation._id,
          )
        ) {
          setSelectedConversation(null);
        }
      }
    } catch (error: any) {
      toast.error(
        error instanceof Error ? error.message : "Error fetching conversations",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [friends]);

  return { conversations, loading, getConversations: fetchConversations };
};

export default useGetConversations;
