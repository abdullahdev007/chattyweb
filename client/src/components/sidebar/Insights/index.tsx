import { FC, useEffect } from "react";
import { FaBrain, FaClock } from "react-icons/fa";
import { useConversation, useInsights } from "@/stores";
import { IoRefresh } from "react-icons/io5";
import useGetConversationInsights from "@/hooks/conversations/useGetConversationInsights";
import toast from "react-hot-toast";

const Insights: FC = () => {
  const { selectedConversation } = useConversation();
  const { insights, loading, lastRefresh, getConversationInsights } =
    useGetConversationInsights();

  const { isInsightsStale } = useInsights();

  useEffect(() => {
    if (selectedConversation) {
      getConversationInsights(selectedConversation._id.toString());
    }
  }, [selectedConversation?._id]);

  const handleRefresh = () => {
    if (selectedConversation) {
      getConversationInsights(selectedConversation._id.toString());
    }
  };

  // Check if insights are up-to-date to disable refresh button
  const isInsightsUpToDate =
    selectedConversation && insights
      ? !isInsightsStale(
          selectedConversation._id.toString(),
          selectedConversation.messages?.length || 0
        )
      : false;

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case "positive":
        return "text-success";
      case "negative":
        return "text-error";
      default:
        return "text-warning";
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case "positive":
        return "😊";
      case "negative":
        return "😔";
      default:
        return "😐";
    }
  };

  if (!selectedConversation) {
    return (
      <div className="py-4 text-center">
        <div className="flex flex-col items-center gap-3 text-base-content/60">
          <FaBrain className="text-4xl opacity-50" />
          <p className="text-sm">Select a conversation to view AI insights</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-2 sm:py-3 md:py-4 space-y-2 sm:space-y-3 md:space-y-4 flex flex-col min-h-0 max-h-64 sm:max-h-none overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 sm:gap-2 min-w-0">
          <FaBrain className="text-primary text-base sm:text-lg flex-shrink-0" />
          <h3 className="font-semibold text-base-content text-sm sm:text-base truncate">
            AI Insights
          </h3>
        </div>

        <button
          onClick={handleRefresh}
          disabled={loading || isInsightsUpToDate}
          className={`btn btn-xs sm:btn-sm btn-circle flex-shrink-0 ${
            !isInsightsUpToDate ? "btn-primary" : "btn-disabled"
          }`}
          title={
            isInsightsUpToDate
              ? "You already have the latest insights!"
              : "Refresh insights"
          }
        >
          {loading ? (
            <span className="loading loading-spinner loading-xs"></span>
          ) : (
            <IoRefresh className="text-xs sm:text-sm" />
          )}
        </button>
      </div>

      {/* Last Refresh Info */}
      {lastRefresh && (
        <div className="flex items-center gap-1 sm:gap-2 text-xs text-base-content/60 px-1">
          <FaClock className="flex-shrink-0" />
          <span className="truncate">
            Last updated: {new Date(lastRefresh).toLocaleTimeString()}
          </span>
        </div>
      )}

      {/* Insights Content */}
      {insights && (
        <div className="space-y-2 sm:space-y-3">
          {/* Sentiment */}
          <div className="p-2 sm:p-3 bg-base-200 rounded-lg">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-sm sm:text-base">Sentiment:</span>
              <div className="flex items-center gap-1 sm:gap-2">
                <span className="text-lg sm:text-xl">
                  {getSentimentIcon(insights.sentiment)}
                </span>
                <span
                  className={`text-sm sm:text-base font-medium ${getSentimentColor(insights.sentiment)}`}
                >
                  {insights.sentiment.charAt(0).toUpperCase() +
                    insights.sentiment.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="p-2 sm:p-3 bg-base-200 rounded-lg">
            <h4 className="font-bold text-sm sm:text-base mb-2">Summary</h4>
            <p className="text-xs sm:text-sm text-base-content/80 leading-relaxed break-words">
              {insights.summary}
            </p>
          </div>

          {/* Key Takeaways */}
          <div className="p-2 sm:p-3 bg-base-200 rounded-lg">
            <h4 className="font-bold text-sm sm:text-base mb-2">
              Key Takeaways
            </h4>
            <ul className="space-y-1 sm:space-y-2">
              {insights.keyTakeaways.map((takeaway, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="badge badge-primary badge-xs mt-1 flex-shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-xs sm:text-sm text-base-content/80 break-words">
                    {takeaway}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Insights;
