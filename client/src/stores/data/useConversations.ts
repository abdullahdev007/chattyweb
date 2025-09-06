import { create } from "zustand";
import { Conversation } from "@shared/types/models/conversation";
import useConversation from "./useConversation";

interface ConversationsState {
  conversations: Conversation[];
  setConversations: (conversations: Conversation[]) => void;
  updateConversation: (updatedConversation: Conversation) => void;
}

const useConversations = create<ConversationsState>((set) => ({
  conversations: [],
  setConversations: (conversations) => set({ conversations }),
  updateConversation: (updatedConversation) => {
    set((state) => ({
      conversations: state.conversations.map((conversation) => {
        if (conversation._id === updatedConversation._id) {
          return updatedConversation;
        }
        return conversation;
      }),
    }));

    // Also update selected conversation if it matches the updated conversation
    const { selectedConversation, setSelectedConversation } =
      useConversation.getState();
    if (selectedConversation?._id === updatedConversation._id) {
      setSelectedConversation(updatedConversation);
    }
  },
}));

export default useConversations;
