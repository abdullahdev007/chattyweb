import { useEffect } from "react";
import { useSocketContext } from "../../context/socketContext";
import useFriendRequests from "../../zustand/useFriendRequests";
import useFriends from "../../zustand/useFriends";
import { RespondToFriendRequestPayload } from "@shared/types/socket";

const useListenResponseToFriendRequest = () => {
  const { socket } = useSocketContext();
  const { removeFriendRequest } = useFriendRequests();
  const { addFriend } = useFriends();

  useEffect(() => {
    const handleResponse = ({
      user,
      response,
    }: RespondToFriendRequestPayload) => {
      removeFriendRequest(user._id);
      if (response === "accept") {
        addFriend(user);
      }
    };

    socket?.on("respondToFriendRequest", handleResponse);

    return () => {
      socket?.off("respondToFriendRequest", handleResponse);
    };
  }, [addFriend, removeFriendRequest, socket]);
};

export default useListenResponseToFriendRequest;
