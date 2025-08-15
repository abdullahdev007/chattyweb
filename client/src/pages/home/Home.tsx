import { FC } from "react";
import MessageContainer from "@/components/messages/MessageContainer";
import AddFriendModal from "@/components/modals/AddFriendModal/AddFriendModal";
import ManageFriendsModal from "@/components/modals/ManageFriendsModal/ManageFriendsModal";
import NotificationsModal from "@/components/modals/NotificationsModal/NotificationsModal";
import PendingFriendShipsListModal from "@/components/modals/PendingFriendShipsListModal/PendingFriendShipsListModal";
import Sidebar from "@/components/sidebar/Sidebar";

const Home: FC = () => {
  return (
    <>
      <div
        className="flex rounded-lg overflow-hidden bg-gray-400 bg-clip-padding \
      backdrop-filter backdrop-blur-lg bg-opacity-0 w-full h-5/6 max-sm:flex-col sm:ml-10 sm:mr-10"
      >
        <Sidebar />
        <MessageContainer />
      </div>
      <AddFriendModal />
      <ManageFriendsModal />
      <NotificationsModal />
      <PendingFriendShipsListModal />
    </>
  );
};

export default Home;
