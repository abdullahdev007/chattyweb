import { useAuthContext } from "@/context/AuthContext";
import { SignupRequestBody, SignupResponseBody } from "@shared/types/http";
import { useState } from "react";
import toast from "react-hot-toast";

const useSignup = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { setAuthUser } = useAuthContext();

  const signup = async ({
    fullName,
    username,
    password,
    confirmPassword,
    gender,
  }: SignupRequestBody): Promise<void> => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          username,
          password,
          confirmPassword,
          gender,
        }),
      });
      const data: SignupResponseBody = await res.json();
      if (!data.success) throw new Error(data.message);

      setAuthUser(data.user);
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, signup };
};

export default useSignup;
