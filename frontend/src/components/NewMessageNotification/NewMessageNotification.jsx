import useConversation from "../../zustand/useConversation";
import useConversations from "../../zustand/useConversations";
import { useAuthContext } from "../../context/AuthContext";
import useMarkMessagesAsReaded from "../../hooks/conversations/useMarkMessagesAsReaded";

const NewMessageNotification = ({t , newMessage }) => {
    const  { setSelectedConversation } = useConversation();
    const { conversations } = useConversations();
    const { authUser } = useAuthContext();
    const { markMessagesAsReaded } = useMarkMessagesAsReaded();

  return (
    <div
        className={`${
        t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 cursor-pointer`}

        onClick={() => {
            const conversation = conversations.find(conv =>
                conv.participants.some(participant => participant.userId._id === newMessage.senderId._id) &&
                conv.participants.some(participant => participant.userId._id === authUser._id)
              );
              const currentUserObject = conversation.participants.find((u) => u.userId._id === authUser._id);
              const unReadCount = currentUserObject.unreadCount ;
              if(unReadCount > 0) markMessagesAsReaded(conversation._id);

              console.log(conversation);
              

              setSelectedConversation(conversation);
        }}
    >
        <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
            <img
                className="h-10 w-10 rounded-full"
                src={ newMessage.senderId.profilePic }
                alt=""
            />
            </div>
            <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">
                { newMessage.senderId.fullName }
            </p>
            <p className="mt-1 text-sm text-gray-500">
                { newMessage.message }
            </p>
            </div>
        </div>
        </div>
        <div className="flex border-l border-gray-200">

        </div>
    </div>
  )
}

export default NewMessageNotification
