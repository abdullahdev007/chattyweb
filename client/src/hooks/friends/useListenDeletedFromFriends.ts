import { useEffect } from "react";
import { useSocketContext } from "@/context/socketContext";
import useFriends from "@/zustand/useFriends";
import { DeletedFromFriendsPayload } from "@shared/types/socket";

const useListenDeletedFromFriends = () => {
  const { socket } = useSocketContext();
  const { removeFriend } = useFriends();

  useEffect(() => {
    const handleDeleted = (user: DeletedFromFriendsPayload) => {
      removeFriend(user._id);
    };

    socket?.on("deletedFromFriends", handleDeleted);

    return () => {
      socket?.off("deletedFromFriends", handleDeleted);
    };
  }, [removeFriend, socket]);
};

export default useListenDeletedFromFriends;
