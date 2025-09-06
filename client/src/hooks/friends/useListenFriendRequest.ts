import { useEffect } from "react";
import { useSocketContext } from "../../context/socketContext";
import { useFriendRequests } from "@/stores";
import { NewFriendRequestPayload } from "@shared/types/socket";

const useListenFriendRequest = () => {
  const { socket } = useSocketContext();
  const { addFriendRequest } = useFriendRequests();

  useEffect(() => {
    const handleNewRequest = (user: NewFriendRequestPayload) => {
      addFriendRequest(user);
    };

    socket?.on("newFriendRequest", handleNewRequest);

    return () => {
      socket?.off("newFriendRequest", handleNewRequest);
    };
  }, [addFriendRequest, socket]);
};

export default useListenFriendRequest;
