import React from "react";
import MenuBar from "../MenuBar/MenuBar";
import Sidebar from "../Sidebar/Sidebar";

const Layout = ({ children, user }) => {
  return (
    <div className="flex flex-col h-[100vh]">
      <MenuBar name={user.displayName} />
      <div className="flex h-full bg-second">
        <Sidebar />
        <div className="flex flex-col w-full p-4 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
