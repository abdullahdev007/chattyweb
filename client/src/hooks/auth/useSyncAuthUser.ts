import { useEffect } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { useSocketContext } from "@/context/socketContext";
import { SyncAuthUserPayload } from "@shared/types/socket/auth";

export function useSyncAuthUser() {
  const { setAuthUser } = useAuthContext();
  const { socket } = useSocketContext();

  useEffect(() => {
    if (!socket) return;

    socket.on("userUpdated", ({ newUserData }: SyncAuthUserPayload) => {
      console.log("sync", newUserData);

      setAuthUser(newUserData);
    });

    return () => {
      socket.off("userUpdated");
    };
  }, [setAuthUser]);
}
