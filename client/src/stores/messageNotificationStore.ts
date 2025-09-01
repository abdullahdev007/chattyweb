import { create } from "zustand";
import { Message } from "@shared/types/models/message";

interface MessageQueueItem {
  toastId: string;
  newMessage: Message;
}

interface MessageNotificationStore {
  messageQueue: MessageQueueItem[];
  pushMessage: (message: MessageQueueItem) => void;
  popMessage: () => void;
}

const useMessageNotificationStore = create<MessageNotificationStore>((set) => ({
  messageQueue: [],
  pushMessage: (message) =>
    set((state) => ({ messageQueue: [...state.messageQueue, message] })),
  popMessage: () =>
    set((state) => ({ messageQueue: state.messageQueue.slice(1) })),
}));

export default useMessageNotificationStore;
