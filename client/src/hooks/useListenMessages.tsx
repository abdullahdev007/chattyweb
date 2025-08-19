import { useEffect } from "react";
import { useSocketContext } from "@/context/socketContext";
import useConversation from "@/zustand/useConversation";
import useIncreaseUnreadCount from "./conversations/useIncreaseUnreadCount";
import useConversations from "@/zustand/useConversations";
import toast from "react-hot-toast";
import NewMessageNotification from "@/components/NewMessageNotification/NewMessageNotification";
import useMessageNotificationStore from "@/zustand/messageNotificationStore";
import { SendMessagePayload } from "@shared/types/socket";
import { ClientMessage } from "@/types/MessageTypes";

const useListenMessages = () => {
  const { socket } = useSocketContext();
  const { messages, setMessages, selectedConversation } = useConversation();
  const { increaseUnreadCount } = useIncreaseUnreadCount();
  const { updateConversation } = useConversations();

  const { messageQueue, pushMessage, popMessage } = useMessageNotificationStore(
    (state) => ({
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
        (newMessage as ClientMessage).shouldShake = true;

        setMessages([...messages, newMessage]);
        updateConversation(conversation);
      } else {
        increaseUnreadCount(conversation._id);

        pushMessage({
          toastId: toast.custom(
            (t) => <NewMessageNotification t={t} newMessage={newMessage} />,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
