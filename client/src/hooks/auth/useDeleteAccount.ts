import toast from "react-hot-toast";
import { useAuthContext } from "context/AuthContext";
import { useState } from "react";
import { DeleteAccountResponse } from "types/auth";

const useDeleteAccount = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { setAuthUser } = useAuthContext();

  const deleteAccount = async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/delete-account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      const data: DeleteAccountResponse = await res.json();
      if (data.error) {
        console.log("error");
        throw new Error(data.error);
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
