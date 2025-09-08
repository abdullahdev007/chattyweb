import { useState } from "react";
import toast from "react-hot-toast";
import { GetUserResponseBody } from "@shared/types/http/modules/user";
const useGetUser = () => {
  const [loading, setLoading] = useState<Boolean>(false);

  const getUser = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${id}`);
      const data: GetUserResponseBody = await res.json();

      if (!data.success) throw new Error(data.message);

      return data.user;
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, getUser };
};
export default useGetUser;
