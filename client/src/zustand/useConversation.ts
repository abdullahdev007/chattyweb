import { create } from "zustand";
import { IConversation } from "@shared/types/models/conversation";
import { IMessage } from "@shared/types/models/message";

interface ConversationState {
  selectedConversation: IConversation | null;
  setSelectedConversation: (selectedConversation: IConversation | null) => void;
  messages: IMessage[];
  setMessages: (messages: IMessage[]) => void;
  replyToMessage: IMessage | null;
  setReplyToMessage: (message: IMessage | null) => void;
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
