import { create } from "zustand";
import { persist } from "zustand/middleware";

interface InsightsData {
  summary: string;
  sentiment: string;
  keyTakeaways: string[];
}

interface InsightsState {
  insights: Record<string, InsightsData>;
  lastUpdated: Record<string, Date>;
  messageCounts: Record<string, number>;

  // Actions
  setInsights: (
    conversationId: string,
    insights: InsightsData,
    messageCount: number
  ) => void;
  getInsights: (conversationId: string) => InsightsData | null;
  isInsightsStale: (
    conversationId: string,
    currentMessageCount: number
  ) => boolean;
  clearInsights: (conversationId: string) => void;
  clearAllInsights: () => void;
}

const useInsights = create<InsightsState>()(
  persist(
    (set, get) => ({
      insights: {},
      lastUpdated: {},
      messageCounts: {},

      setInsights: (
        conversationId: string,
        insights: InsightsData,
        messageCount: number
      ) => {
        set((state) => ({
          insights: {
            ...state.insights,
            [conversationId]: insights,
          },
          lastUpdated: {
            ...state.lastUpdated,
            [conversationId]: new Date(),
          },
          messageCounts: {
            ...state.messageCounts,
            [conversationId]: messageCount,
          },
        }));
      },

      getInsights: (conversationId: string) => {
        return get().insights[conversationId] || null;
      },

      isInsightsStale: (
        conversationId: string,
        currentMessageCount: number
      ) => {
        const state = get();
        const storedCount = state.messageCounts[conversationId] || 0;
        const lastUpdate = state.lastUpdated[conversationId];

        // If no insights exist, they're stale
        if (!lastUpdate) return true;

        // If message count changed, insights are stale
        if (storedCount !== currentMessageCount) return true;

        return false;
      },

      clearInsights: (conversationId: string) => {
        set((state) => {
          const newInsights = { ...state.insights };
          const newLastUpdated = { ...state.lastUpdated };
          const newMessageCounts = { ...state.messageCounts };

          delete newInsights[conversationId];
          delete newLastUpdated[conversationId];
          delete newMessageCounts[conversationId];

          return {
            insights: newInsights,
            lastUpdated: newLastUpdated,
            messageCounts: newMessageCounts,
          };
        });
      },

      clearAllInsights: () => {
        set({
          insights: {},
          lastUpdated: {},
          messageCounts: {},
        });
      },

      // updateMessageCount is now handled within setInsights
    }),
    {
      name: "chattyweb-insights", // localStorage key
      partialize: (state) => ({
        insights: state.insights,
        lastUpdated: state.lastUpdated,
        messageCounts: state.messageCounts,
      }),
    }
  )
);

export default useInsights;
