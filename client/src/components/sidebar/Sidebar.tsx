import { FC } from "react";
import TabbedSidebar from "./TabbedSidebar";

const Sidebar: FC = () => {
  return (
    <div
      className="
        border-r border-base-content border-opacity-40 
        p-2 sm:p-3 md:p-4
        w-full sm:w-64 md:w-72 lg:w-80
        min-w-0 sm:min-w-48
        max-w-full sm:max-w-none
        h-auto sm:h-full
        flex flex-col
        shadow-sm
        flex-shrink-0
      "
    >
      <TabbedSidebar />
    </div>
  );
};

export default Sidebar;
