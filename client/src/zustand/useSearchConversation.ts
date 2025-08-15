import { create } from "zustand";

interface SearchConversationState {
  searchConversation: string;
  setSearchConversation: (searchConversation: string) => void;
}

const useSearchConversation = create<SearchConversationState>((set) => ({
  searchConversation: "",
  setSearchConversation: (searchConversation) => set({ searchConversation }),
}));

export default useSearchConversation;
