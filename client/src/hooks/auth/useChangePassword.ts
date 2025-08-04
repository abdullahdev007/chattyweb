import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import type {
  ChangePasswordRequestBody,
  BaseResponse,
} from "@shared/types/http";

const useChangePassword = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const changePassword = async ({
    password,
    confirmPassword,
  }: ChangePasswordRequestBody): Promise<void> => {
    const success = handleInputErrors({ password, confirmPassword });
    if (!success) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, confirmPassword }),
      });

      const data: BaseResponse = await res.json();

      if (data.message) {
        throw new Error(data.message);
      }

      navigate("/");
      toast.success(data.message!);
    } catch (error) {
      const err = error as Error;
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, changePassword };
};

export default useChangePassword;

function handleInputErrors({
  password,
  confirmPassword,
}: ChangePasswordRequestBody): boolean {
  if (!password || !confirmPassword) {
    toast.error("Please fill in all fields");
    return false;
  }
  if (password !== confirmPassword) {
    toast.error("Passwords do not match");
    return false;
  }
  return true;
}
