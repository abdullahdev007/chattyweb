import toast from "react-hot-toast";
import { useAuthContext } from "../../context/AuthContext";
import { useState } from "react";
import { LogoutResponse } from "types/auth";

const useLogout = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { setAuthUser } = useAuthContext();

  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data: LogoutResponse = await res.json();
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

  return { loading, logout };
};

export default useLogout;
