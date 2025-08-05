import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useUsers from "@/zustand/useUsers";
import useFriends from "@/zustand/useFriends";
import useFriendRequests from "@/zustand/useFriendRequests";
import { GetUsersResponseBody } from "@shared/types/http/modules/user";

const useGetUsers = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { users, setUsers } = useUsers();
  const { friends } = useFriends();
  const { friendRequests } = useFriendRequests();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/users`);
      const data: GetUsersResponseBody = await res.json();

      if (data.success) throw new Error(data.message);

      if (data.users) setUsers(data.users);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [friends, friendRequests]);

  return { users, loading, fetchUsers };
};
export default useGetUsers;
