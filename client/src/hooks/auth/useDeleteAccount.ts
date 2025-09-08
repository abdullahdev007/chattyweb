import toast from "react-hot-toast";
import useAuthStore from "@/stores/core/useAuthStore";
import { useState } from "react";
import { BaseResponse } from "@shared/types/http";

const useDeleteAccount = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { setAuthUser } = useAuthStore();

  const deleteAccount = async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/delete-account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      const data: BaseResponse = await res.json();
      if (!data.success) {
        throw new Error(data.message);
      }

      localStorage.removeItem("chat-user");
      setAuthUser(null);
    } catch (error) {
      toast.error((error as Error).message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, deleteAccount };
};

export default useDeleteAccount;
