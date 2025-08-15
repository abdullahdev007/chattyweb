import { SafeUser } from "@shared/types/models/user";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";

interface AuthContextType {
  authUser: SafeUser | null;
  setAuthUser: Dispatch<SetStateAction<any>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuthContext must be used within an AuthContextProvider",
    );
  }
  return context;
};

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}) => {
  const storedUser = localStorage.getItem("chat-user");
  const [authUser, setAuthUser] = useState<SafeUser>(
    storedUser ? JSON.parse(storedUser) : null,
  );

  useEffect(() => {
    if (authUser === null) return localStorage.removeItem("chat-user");
    else {
      localStorage.setItem("chat-user", JSON.stringify(authUser));
    }
  }, [authUser]);
  return (
    <AuthContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};
