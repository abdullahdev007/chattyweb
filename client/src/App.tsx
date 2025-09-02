import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthContext } from "@/context/AuthContext";
import { useEffect } from "react";
import Cookies from "js-cookie";

import { ThemeProvider } from "@/context/themeContext";
import { SidebarProvider } from "@/context/sidebarContext";

import useListenDeletedFromFriends from "@/hooks/friends/useListenDeletedFromFriends";
import useListenFriendRequest from "@/hooks/friends/useListenFriendRequest";
import useListenResponseToFriendRequest from "@/hooks/friends/useListenResponseToFriendRequest";
import useListenNotifications from "@/hooks/notifications/useListenNotifications";
import useListenMessages from "@/hooks/messages/useListenMessages";
import { useSyncAuthUser } from "@/hooks/auth/useSyncAuthUser";

import ChangePassword from "@/pages/changePassword/ChangePassword";
import UpdateProfile from "@/pages/updateProfile/UpdateProfile";
import Home from "@/pages/home/Home";
import Login from "@/pages/login/Login";
import Signup from "@/pages/signup/Signup";

import Navbar from "@/layout/Navbar/Navbar";
import Footar from "@/layout/Footer/Footer";
import AnimatedBackground from "@/layout/AnimatedBackground";

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
      <SidebarProvider>
        <AnimatedBackground />
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
            <Toaster toastOptions={{ }} />
          </div>
          <Footar />
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default App;
