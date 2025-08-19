import { FC, useState } from "react";
import { SearchConversation } from "@/components/SearchConversationInput/SearchConversation";
import DeleteAccountModal from "@/components/modals/deleteAccountModal/DeleteAccountModal";
import { useAuthContext } from "@/context/AuthContext";
import useLogout from "@/hooks/auth/useLogout";
import { FaUser, FaUserPlus, FaUserFriends } from "react-icons/fa";
import useFriendRequests from "@/zustand/useFriendRequests";
import { IoMdNotifications } from "react-icons/io";
import useNotifications from "@/zustand/useNotifications";
import useMarkAsReaded from "@/hooks/notifications/useMarkAsReaded";
import { SafeUser } from "@shared/types/models/user";
import ThemeToggle from "@/components/ThemeToggle";
import { HiMenu, HiX } from "react-icons/hi";
import { IoNotifications, IoPerson } from "react-icons/io5";

interface ProfileDropdownProps {
  authUser: SafeUser;
}

const Navbar: FC = () => {
  const { authUser } = useAuthContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { friendRequests } = useFriendRequests();
  const { unReadedNotificationsCount } = useNotifications();
  const { markAsReaded } = useMarkAsReaded();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-base-200 shadow-sm border-b border-base-300 z-50 relative">
      {/* Main Navbar Container */}
      <div className=" mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="flex items-center justify-between h-16 max-xs:my-5 max-xs:flex-col">
          {/* Logo Section - Always visible */}
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center gap-2">
              <img
                src="/logo.png"
                alt="ChattyWeb Logo"
                className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
              />
              <span className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                ChattyWeb
              </span>
            </a>
          </div>

          {/* Desktop Search Section - Only for logged in users */}
          {authUser && (
            <div className="hidden lg:flex flex-1 max-w-md mx-8">
              <SearchConversation />
            </div>
          )}

          {/* Desktop Actions Section */}
          <div className="hidden lg:flex items-center  gap-3">
            {/* Theme Toggle - Always visible */}
            <ThemeToggle />

            {authUser ? (
              <>
                <FriendRequestsDropdown />
                <ManageFriendsButton />
                <AddFriendButton />
                <NotificationsDropdown />
                <ProfileDropdown authUser={authUser} />
              </>
            ) : (
              <RegisterLogin />
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center gap-2 justify-center  align-center  ">
            <ThemeToggle />
            <button
              onClick={toggleMobileMenu}
              className="btn btn-ghost btn-md  p-2 rounded-lg  focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <HiX className="block h-5 w-5" aria-hidden="true" />
              ) : (
                <HiMenu className="block h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar - Only for logged in users */}
        {authUser && (
          <div className="lg:hidden pb-4 w-full">
            <SearchConversation />
          </div>
        )}

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-base-300">
              {authUser ? (
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between px-3 py-2">
                    <span className="text-sm font-medium text-base-content/70">
                      Quick Actions
                    </span>
                    {authUser && <ProfileDropdown authUser={authUser} />}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <MobileActionButton
                      icon={<FaUser className="h-5 w-5" />}
                      label="Friend Requests"
                      onClick={() => {
                        const modal = document.getElementById(
                          "pending_friendships_modal",
                        ) as HTMLDialogElement;
                        if (modal) modal.showModal();
                        setIsMobileMenuOpen(false);
                      }}
                      badge={friendRequests.length}
                    />
                    <MobileActionButton
                      icon={<FaUserFriends className="h-5 w-5" />}
                      label="Manage Friends"
                      onClick={() => {
                        const modal = document.getElementById(
                          "manage_friends_modal",
                        ) as HTMLDialogElement;
                        if (modal) modal.showModal();
                        setIsMobileMenuOpen(false);
                      }}
                    />
                    <MobileActionButton
                      icon={<FaUserPlus className="h-5 w-5" />}
                      label="Add Friend"
                      onClick={() => {
                        const modal = document.getElementById(
                          "add_friend_modal",
                        ) as HTMLDialogElement;
                        if (modal) modal.showModal();
                        setIsMobileMenuOpen(false);
                      }}
                    />
                    <MobileActionButton
                      icon={<IoMdNotifications className="h-5 w-5" />}
                      label="Notifications"
                      onClick={() => {
                        const modal = document.getElementById(
                          "notifications_modal",
                        ) as HTMLDialogElement;
                        if (modal) {
                          modal.showModal();
                          markAsReaded();
                        }
                        setIsMobileMenuOpen(false);
                      }}
                      badge={unReadedNotificationsCount}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  <a
                    href="/signup"
                    className="btn btn-primary w-full"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </a>
                  <a
                    href="/login"
                    className="btn btn-outline w-full"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// Mobile Action Button Component
const MobileActionButton: FC<{
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  badge?: number;
}> = ({ icon, label, onClick, badge }) => {
  return (
    <button
      onClick={onClick}
      className="relative flex flex-col items-center justify-center p-3 rounded-lg bg-base-300  transition-all duration-200 group shadow-sm"
    >
      <div className="relative">
        <div className="text-base-content/70 group-hover:text-primary transition-colors duration-200">
          {icon}
        </div>
      </div>
      {badge && badge > 0 ? (
        <span className="absolute -top-1 -right-1 badge badge-error badge-md animate-pulse">
          {badge}
        </span>
      ) : (
        <></>
      )}
      <span className="mt-1 text-xs font-medium text-base-content/70 group-hover:text-primary transition-colors duration-200">
        {label}
      </span>
    </button>
  );
};

const ProfileDropdown: FC<ProfileDropdownProps> = ({ authUser }) => {
  const { loading, logout } = useLogout();

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = `/avatars/${authUser.gender}.png`;
  };

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="flex items-center justify-center w-10 h-10 rounded-full ring-2 ring-primary cursor-pointer hover:scale-105"
      >
        <img
          alt="Profile Pic"
          src={authUser.profilePic}
          onError={handleImageError}
          className="w-full h-full object-cover rounded-full"
        />
      </div>

      <ul
        tabIndex={0}
        className="mt-3 z-[1] p-2 shadow-xl menu menu-sm dropdown-content bg-base-100 rounded-xl w-56 border border-base-300"
      >
        <li className="mb-2">
          <span className="text-base-content/70 text-sm">
            Hello {authUser.fullName}!
          </span>
        </li>
        <div className="divider my-2"></div>
        <li>
          <a
            href="/update-profile"
            className="hover:bg-primary/10 transition-colors duration-200 rounded-lg"
          >
            Update Profile
          </a>
        </li>
        <li>
          <a
            href="/change-password"
            className="hover:bg-primary/10 transition-colors duration-200 rounded-lg"
          >
            Change Password
          </a>
        </li>
        <li
          onClick={() => {
            const modal = document.getElementById(
              "delete-account-modal",
            ) as HTMLDialogElement | null;
            if (modal) modal.showModal();
          }}
        >
          <a
            href="#"
            className="hover:bg-error/10 text-error transition-colors duration-200 rounded-lg"
          >
            Delete Account
          </a>
        </li>
        <div className="divider my-2"></div>
        {!loading ? (
          <li onClick={logout}>
            <a className="hover:bg-error/10 text-error transition-colors duration-200 rounded-lg">
              Logout
            </a>
          </li>
        ) : (
          <li className="flex justify-center">
            <span className="loading loading-spinner loading-sm"></span>
          </li>
        )}
      </ul>

      <DeleteAccountModal />
    </div>
  );
};

const NotificationsDropdown: FC = () => {
  const { unReadedNotificationsCount } = useNotifications();
  const { markAsReaded } = useMarkAsReaded();

  const handleClick = () => {
    const modal = document.getElementById(
      "notifications_modal",
    ) as HTMLDialogElement;
    if (modal) {
      modal.showModal();
      markAsReaded();
    }
  };

  return (
    <button
      className="relative flex items-center justify-center w-5 h-5 rounded-lg"
      onClick={handleClick}
      title="Notifications"
    >
      <IoNotifications className="h-5 w-5 text-base-content" />
      {unReadedNotificationsCount > 0 && (
        <span className="absolute -top-1 -right-1 badge badge-error badge-sm animate-pulse">
          {unReadedNotificationsCount}
        </span>
      )}
    </button>
  );
};

const AddFriendButton: FC = () => {
  const handleClick = () => {
    const modal = document.getElementById(
      "add_friend_modal",
    ) as HTMLDialogElement;
    if (modal) modal.showModal();
  };

  return (
    <button
      className="flex items-center justify-center w-5 h-5 rounded-lg"
      onClick={handleClick}
      title="Add Friend"
    >
      <FaUserPlus className="h-5 w-5 text-base-content" />
    </button>
  );
};

const ManageFriendsButton: FC = () => {
  const handleClick = () => {
    const modal = document.getElementById(
      "manage_friends_modal",
    ) as HTMLDialogElement;
    if (modal) modal.showModal();
  };

  return (
    <button
      className="flex items-center justify-center w-5 h-5 rounded-lg"
      onClick={handleClick}
      title="Manage Friends"
    >
      <FaUserFriends className="h-5 w-5 text-base-content" />
    </button>
  );
};

const FriendRequestsDropdown: FC = () => {
  const { friendRequests } = useFriendRequests();

  const handleClick = () => {
    const modal = document.getElementById(
      "pending_friendships_modal",
    ) as HTMLDialogElement;
    if (modal) modal.showModal();
  };

  return (
    <button
      className="relative flex items-center justify-center w-5 h-5 rounded-lg"
      onClick={handleClick}
      title="Friend Requests"
    >
      <IoPerson className="h-5 w-5 text-base-content" />
      {friendRequests.length > 0 && (
        <span className="absolute -top-1 -right-1 badge badge-warning badge-sm animate-pulse">
          {friendRequests.length}
        </span>
      )}
    </button>
  );
};

const RegisterLogin: FC = () => {
  return (
    <div className="flex items-center gap-2">
      <a
        href="/signup"
        className="btn btn-primary btn-sm hover:scale-105 transition-transform duration-200"
      >
        Sign Up
      </a>
      <a
        href="/login"
        className="btn btn-outline btn-sm hover:scale-105 transition-transform duration-200"
      >
        Login
      </a>
    </div>
  );
};

export default Navbar;
