import { IConversation } from "@shared/types/models/conversation";
import { create } from "zustand";

interface ConversationsState {
  conversations: IConversation[];
  setConversations: (conversations: IConversation[]) => void;
  updateConversation: (updatedConversation: IConversation) => void;
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
  },
}));

export default useConversations;
