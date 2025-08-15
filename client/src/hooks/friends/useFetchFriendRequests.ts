import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useFriendRequests from "../../zustand/useFriendRequests";
import { GetFriendRequestsResponse } from "@shared/types/http";

const useGetFriendRequests = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { friendRequests, setFriendRequests } = useFriendRequests();

  useEffect(() => {
    const fetchFriendRequests = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/friends/requests");
        const data: GetFriendRequestsResponse = await res.json();

        if (!data.success) {
          throw new Error(data.message);
        }

        if (data.friendRequests) setFriendRequests(data.friendRequests);
      } catch (error: any) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to fetch friend requests",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFriendRequests();
  }, [setFriendRequests]);

  return { loading, friendRequests };
};

export default useGetFriendRequests;
