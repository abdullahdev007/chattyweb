import { createContext, useContext, useState, ReactNode, FC } from "react";

type SidebarTab = "conversations" | "insights";

interface SidebarContextType {
  activeTab: SidebarTab;
  setActiveTab: (tab: SidebarTab) => void;
  switchToInsights: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebarContext = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebarContext must be used within a SidebarProvider");
  }
  return context;
};

interface SidebarProviderProps {
  children: ReactNode;
}

export const SidebarProvider: FC<SidebarProviderProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<SidebarTab>("conversations");

  const switchToInsights = () => {
    setActiveTab("insights");
  };

  const value: SidebarContextType = {
    activeTab,
    setActiveTab,
    switchToInsights,
  };

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
};
