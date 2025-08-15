import { create } from "zustand";
import { IConversation } from "@shared/types/models/conversation";
import { IMessage } from "@shared/types/models/message";

interface ConversationState {
  selectedConversation: IConversation | null;
  setSelectedConversation: (selectedConversation: IConversation | null) => void;
  messages: IMessage[];
  setMessages: (messages: IMessage[]) => void;
}

const useConversation = create<ConversationState>((set) => ({
  selectedConversation: null,
  setSelectedConversation: (selectedConversation) =>
    set({ selectedConversation }),
  messages: [],
  setMessages: (messages) => set({ messages }),
}));

export default useConversation;
