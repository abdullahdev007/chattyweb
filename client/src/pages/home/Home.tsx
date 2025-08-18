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
      <div className="bg-base-200 shadow-lg rounded-lg overflow-hidden w-full h-full max-h-[calc(100vh-200px)] flex flex-col sm:flex-row xl:mx-24 lg:mx-12 md:mx-0  max-sm:my-12">
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
