import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useFriends, useFriendRequests } from "@/stores";
import { GetFriendsResponse } from "@shared/types/http";

const useGetFriends = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { friends, setFriends } = useFriends();
  const { friendRequests } = useFriendRequests();

  useEffect(() => {
    const fetchFriends = async (): Promise<void> => {
      setLoading(true);

      try {
        const res = await fetch("/api/friends");
        const data: GetFriendsResponse = await res.json();

        if (!data.success) {
          throw new Error(data.message);
        }

        if (data.friends) setFriends(data.friends);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to fetch friends",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, [friendRequests, setFriends]);

  return { loading, friends };
};

export default useGetFriends;
