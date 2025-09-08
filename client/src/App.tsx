import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import useAuthStore from "@/stores/core/useAuthStore";
import { useEffect } from "react";
import Cookies from "js-cookie";

import useListenDeletedFromFriends from "@/hooks/friends/useListenDeletedFromFriends";
import useListenFriendRequest from "@/hooks/friends/useListenFriendRequest";
import useListenResponseToFriendRequest from "@/hooks/friends/useListenResponseToFriendRequest";
import useListenNotifications from "@/hooks/notifications/useListenNotifications";
import useListenMessages from "@/hooks/messages/useListenMessages";

import ChangePassword from "@/pages/changePassword/ChangePassword";
import UpdateProfile from "@/pages/updateProfile/UpdateProfile";
import Home from "@/pages/home/Home";
import Login from "@/pages/login/Login";
import Signup from "@/pages/signup/Signup";

import Navbar from "@/layout/Navbar/Navbar";
import Footar from "@/layout/Footer/Footer";
import AnimatedBackground from "@/layout/AnimatedBackground";

// Component that needs to access theme context
const AppContent: React.FC = () => {
  const { authUser, setAuthUser } = useAuthStore();

  useListenResponseToFriendRequest();
  useListenMessages();
  useListenFriendRequest();
  useListenNotifications();
  useListenDeletedFromFriends();

  useEffect(() => {
    const token = Cookies.get("jwt");
    if (!token) {
      setAuthUser(null);
    }
  }, [setAuthUser]);

  return (
    <>
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
          <Toaster
            toastOptions={{
              duration: 4000,
              position: "top-center",
              className:
                "bg-base-100 border border-base-300 text-base-content shadow-lg rounded-lg",
              style: {},
            }}
          />
        </div>
        <Footar />
      </div>
    </>
  );
};

const App: React.FC = () => {
  return <AppContent />;
};

export default App;
