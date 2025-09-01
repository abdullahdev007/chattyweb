import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import { Toaster } from "react-hot-toast";
import { useAuthContext } from "./context/AuthContext";
import ChangePassword from "./pages/changePassword/ChangePassword";
import UpdateProfile from "./pages/updateProfile/UpdateProfile";
import { useEffect } from "react";
import Cookies from "js-cookie";

import Navbar from "./layout/Navbar/Navbar";
import Footar from "@/layout/Footer/Footer";

import useListenDeletedFromFriends from "@/hooks/friends/useListenDeletedFromFriends";
import useListenFriendRequest from "@/hooks/friends/useListenFriendRequest";
import useListenResponseToFriendRequest from "@/hooks/friends/useListenResponseToFriendRequest";
import useListenNotifications from "@/hooks/notifications/useListenNotifications";
import useListenMessages from "@/hooks/useListenMessages";
import { useSyncAuthUser } from "@/hooks/auth/useSyncAuthUser";
import { ThemeProvider } from "@/context/themeContext";
import AnimatedBackground from "./components/AnimatedBackground";

const App: React.FC = () => {
  const { authUser, setAuthUser } = useAuthContext();

  useListenResponseToFriendRequest();
  useListenMessages();
  useListenFriendRequest();
  useListenNotifications();
  useListenDeletedFromFriends();
  useSyncAuthUser();

  useEffect(() => {
    const token = Cookies.get("jwt");
    if (!token) {
      setAuthUser(null);
    }
  }, [setAuthUser]);

  return (
    <ThemeProvider>
      <AnimatedBackground/>
      <div className="flex flex-col h-screen">
        <Navbar />
        <div className="p-2 sm:p-4 flex-1 flex items-center justify-center min-h-0">
          <Routes>
            <Route
              path="/"
              element={authUser ? <Home /> : <Navigate to={"/login"} />}
            />
            <Route
              path="/change-password"
              element={
                authUser ? <ChangePassword /> : <Navigate to={"/login"} />
              }
            />
            <Route
              path="/update-profile"
              element={
                authUser ? <UpdateProfile /> : <Navigate to={"/login"} />
              }
            />
            <Route
              path="/login"
              element={!authUser ? <Login /> : <Navigate to={"/"} />}
            />
            <Route
              path="/signup"
              element={!authUser ? <Signup /> : <Navigate to={"/"} />}
            />
          </Routes>
          <Toaster />
        </div>
        <Footar />
      </div>
    </ThemeProvider>
  );
};

export default App;
