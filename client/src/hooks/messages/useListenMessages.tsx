import { useEffect } from "react";
import { useSocketContext } from "@/context/socketContext";
import {
  useConversation,
  useConversations,
  useMessageNotificationStore,
} from "@/stores";
import useIncreaseUnreadCount from "@/hooks/conversations/useIncreaseUnreadCount";
import toast from "react-hot-toast";
import NewMessageNotification from "@/components/NewMessageNotification/NewMessageNotification";
import { SendMessagePayload } from "@shared/types/socket";
import { ClientMessage } from "@/types/MessageTypes";

const useListenMessages = () => {
  const { socket } = useSocketContext();
  const { messages, setMessages, selectedConversation } = useConversation();
  const { increaseUnreadCount } = useIncreaseUnreadCount();
  const { updateConversation } = useConversations();

  const { messageQueue, pushMessage, popMessage } = useMessageNotificationStore(
    (state: any) => ({
      messageQueue: state.messageQueue,
      pushMessage: state.pushMessage,
      popMessage: state.popMessage,
    }),
  );

  useEffect(() => {
    const handleNewMessage = ({
      conversation,
      newMessage,
    }: SendMessagePayload) => {
      if (
        selectedConversation &&
        selectedConversation._id === conversation._id
      ) {
        let message: ClientMessage = newMessage as ClientMessage;
        message.shouldShake = true;

        setMessages([...messages, message]);
        updateConversation(conversation);
      } else {
        increaseUnreadCount(conversation._id.toString());
        pushMessage({
          toastId: toast.custom(
            (t) => (
              <NewMessageNotification
                t={t}
                newMessage={newMessage as ClientMessage}
              />
            ),
            {
              position: "bottom-right",
              duration: 1500,
            },
          ),
          newMessage: newMessage,
        });

        if (messageQueue.length === 1) {
          showNextMessageNotification();
        }
      }
    };

    const showNextMessageNotification = () => {
      if (messageQueue.length === 0) return;

      const { toastId } = messageQueue[0];

      toast.dismiss(toastId);

      setTimeout(() => {
        popMessage();

        if (messageQueue.length > 0) {
          const { newMessage: nextMessage, toastId } = messageQueue[0];

          useMessageNotificationStore.setState((state) => {
            const updatedQueue = [...state.messageQueue];
            updatedQueue[0] = { toastId, newMessage: nextMessage };
            return { messageQueue: updatedQueue };
          });
        }
      }, 2000);
    };

    socket?.on("newMessage", handleNewMessage);

    return () => {
      socket?.off("newMessage");
    };
  }, [
    socket,
    setMessages,
    messages,
    selectedConversation,
    messageQueue,
    pushMessage,
    popMessage,
  ]);
};

export default useListenMessages;
