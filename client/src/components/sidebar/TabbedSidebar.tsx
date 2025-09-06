import { FC } from "react";
import { FaComments, FaBrain } from "react-icons/fa";
import Conversations from "./Conversations";
import Insights from "./Insights";
import { useConversation } from "@/stores";
import { useSidebarContext } from "@/context/sidebarContext";

const TabbedSidebar: FC = () => {
  const { activeTab, setActiveTab } = useSidebarContext();
  const { selectedConversation } = useConversation();

  const handleTabChange = (tab: "conversations" | "insights") => {
    setActiveTab(tab);
  };

  return (
    <div className="flex flex-col h-auto sm:h-full min-h-0">
      {/* Tab Navigation */}
      <div className="tabs tabs-boxed mb-2 sm:mb-3 md:mb-4 p-1">
        <button
          className={`tab flex-1 flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm ${
            activeTab === "conversations" ? "tab-active" : ""
          }`}
          onClick={() => handleTabChange("conversations")}
        >
          <FaComments className="text-sm sm:text-base" />
        </button>
        <button
          className={`tab flex-1 flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm ${
            activeTab === "insights" ? "tab-active" : ""
          }`}
          onClick={() => handleTabChange("insights")}
          disabled={!selectedConversation}
          title={
            !selectedConversation
              ? "Select a conversation first"
              : "View AI Insights"
          }
        >
          <FaBrain className="text-sm sm:text-base" />
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 sm:flex-1 overflow-auto min-h-0 max-h-64 sm:max-h-none">
        {activeTab === "conversations" ? <Conversations /> : <Insights />}
      </div>
    </div>
  );
};

export default TabbedSidebar;
