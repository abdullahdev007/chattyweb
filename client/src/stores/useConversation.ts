import { create } from "zustand";
import { Conversation } from "@shared/types/models/conversation";
import { ClientMessage } from "@/types/MessageTypes";

interface ConversationState {
  selectedConversation: Conversation | null;
  setSelectedConversation: (selectedConversation: Conversation | null) => void;
  messages: ClientMessage[];
  setMessages: (messages: ClientMessage[]) => void;
  replyToMessage: ClientMessage | null;
  setReplyToMessage: (message: ClientMessage | null) => void;
  clearReplyToMessage: () => void;
}

const useConversation = create<ConversationState>((set) => ({
  selectedConversation: null,
  setSelectedConversation: (selectedConversation) => {
    set({ selectedConversation, replyToMessage: null }); // Clear reply when conversation changes
  },
  messages: [],
  setMessages: (messages) => set({ messages }),
  replyToMessage: null,
  setReplyToMessage: (message) => {
    set({ replyToMessage: message });
  },
  clearReplyToMessage: () => set({ replyToMessage: null }),
}));

export default useConversation;
