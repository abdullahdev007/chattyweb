import { useState, useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import { useInsights, useConversation } from "@/stores";

interface InsightsData {
  summary: string;
  sentiment: string;
  keyTakeaways: string[];
}

interface InsightsResponse {
  success: boolean;
  insights: InsightsData;
  message?: string;
}

const useGetConversationInsights = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const { selectedConversation } = useConversation();
  const {
    lastUpdated,
    setInsights: setStoreInsights,
    getInsights: getStoreInsights,
    isInsightsStale,
  } = useInsights();

  const getConversationInsights = useCallback(
    async (conversationId: string) => {
      // Check if we have cached insights and if they're still valid
      const cachedInsights = getStoreInsights(conversationId);
      const currentMessageCount = selectedConversation?.messages?.length || 0;

      if (
        cachedInsights &&
        !isInsightsStale(conversationId, currentMessageCount)
      ) {
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `/api/conversations/insights/${conversationId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          },
        );

        const data: InsightsResponse = await response.json();

        if (!data.success) {
          throw new Error(data.message || "Failed to fetch insights");
        }

        // Store insights in the store (includes message count update)
        setStoreInsights(conversationId, data.insights, currentMessageCount);
      } catch (error: any) {
        toast.error(
          error instanceof Error ? error.message : "Error generating insights",
        );
      } finally {
        setLoading(false);
      }
    },
    [selectedConversation, getStoreInsights, isInsightsStale, setStoreInsights],
  );

  // Get current insights for selected conversation
  const currentInsights = selectedConversation
    ? getStoreInsights(selectedConversation._id.toString())
    : null;

  // Get last updated timestamp for selected conversation
  const currentLastUpdated = selectedConversation
    ? lastUpdated[selectedConversation._id.toString()]
    : null;

  return {
    insights: currentInsights,
    loading,
    lastRefresh: currentLastUpdated,
    getConversationInsights,
  };
};

export default useGetConversationInsights;
