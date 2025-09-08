import { create } from "zustand";

type SidebarTab = "conversations" | "insights";

interface SidebarState {
  activeTab: SidebarTab;
  setActiveTab: (tab: SidebarTab) => void;
  switchToInsights: () => void;
}

const useSidebarState = create<SidebarState>()((set) => ({
  activeTab: "conversations",
  setActiveTab: (tab) => set({ activeTab: tab }),
  switchToInsights: () => set({ activeTab: "insights" }),
}));

export default useSidebarState;
