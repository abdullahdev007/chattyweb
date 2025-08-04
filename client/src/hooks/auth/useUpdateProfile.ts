import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  UpdateProfileRequestBody,
  UpdateProfileResponseBody,
} from "@shared/types/http";
import { useAuthContext } from "@/context/AuthContext";

const useUpdateProfile = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { setAuthUser } = useAuthContext();
  const navigate = useNavigate();

  const updateProfile = async ({
    fullName,
    username,
    gender,
  }: UpdateProfileRequestBody): Promise<void> => {
    const success = handleInputErrors({ fullName, username, gender });
    if (!success) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/update-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, username, gender }),
      });
      const data: UpdateProfileResponseBody = await res.json();
      if (!data.success) throw new Error(data.message);

      localStorage.setItem("chat-user", JSON.stringify(data));
      setAuthUser(data.user);
      navigate("/");
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, updateProfile };
};

export default useUpdateProfile;

function handleInputErrors({
  fullName,
  username,
  gender,
}: UpdateProfileRequestBody): boolean {
  if (!fullName || !username || !gender) {
    toast.error("Please fill in all fields");
    return false;
  }
  return true;
}
