import { useEffect } from "react";
import { useSocketContext } from "../../context/socketContext";
import useFriendRequests from "../../zustand/useFriendRequests";
import { NewFriendRequestPayload } from "@shared/types/socket";
import { useAuthContext } from "@/context/AuthContext";

const useListenFriendRequest = () => {
  const { socket } = useSocketContext();
  const { addFriendRequest } = useFriendRequests();
  const { setAuthUser } = useAuthContext();
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
