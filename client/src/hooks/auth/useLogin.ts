import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "@/context/AuthContext";
import { LoginRequestBody, LoginResponseBody } from "@shared/types/http";
import { Navigate } from "react-router-dom";

const useLogin = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { setAuthUser } = useAuthContext();

  const login = async ({
    username,
    password,
  }: LoginRequestBody): Promise<void> => {
    const success = handleInputErrors({ username, password });
    if (!success) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data: LoginResponseBody = await res.json();
      if (!data.success) {
        throw new Error(data.message);
      }

      if (data.user) {
        setAuthUser(data.user);
      }
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, login };
};

export default useLogin;

function handleInputErrors({ username, password }: LoginRequestBody): boolean {
  if (!username || !password) {
    toast.error("Please fill in all fields");
    return false;
  }
  return true;
}
