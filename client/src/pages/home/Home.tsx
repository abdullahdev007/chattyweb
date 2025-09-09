import { FC } from "react";
import MessageContainer from "@/components/messages/MessageContainer";

import Sidebar from "@/components/sidebar/Sidebar";

const Home: FC = () => {
  return (
    <div
      className="self-stretch flex-1 py-12
         xl:mx-24 lg:mx-12 mx-3"
    >
      <div className="bg-base-200 bg-opacity-70 shadow-lg rounded-lg size-full flex flex-col sm:flex-row sm:max-h-[70vh] max-h-[900px]">
        <Sidebar />
        <MessageContainer />
      </div>
    </div>
  );
};

export default Home;
