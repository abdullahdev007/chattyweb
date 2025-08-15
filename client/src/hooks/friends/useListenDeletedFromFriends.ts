import { useEffect } from "react";
import { useSocketContext } from "@/context/socketContext";
import useFriends from "@/zustand/useFriends";
import { DeletedFromFriendsPayload } from "@shared/types/socket";
import useConversation from "@/zustand/useConversation";

const useListenDeletedFromFriends = () => {
  const { socket } = useSocketContext();
  const { removeFriend } = useFriends();

  useEffect(() => {
    const handleDeleted = (user: DeletedFromFriendsPayload) => {
      removeFriend(user._id);
      console.log("deletet from friends");
    };

    socket?.on("deletedFromFriends", handleDeleted);

    return () => {
      socket?.off("deletedFromFriends", handleDeleted);
    };
  }, [removeFriend, socket]);
};

export default useListenDeletedFromFriends;
