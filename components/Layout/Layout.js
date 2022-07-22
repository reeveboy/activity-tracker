import React from "react";
import MenuBar from "../MenuBar/MenuBar";
import Sidebar from "../Sidebar/Sidebar";
import Head from "next/head";

const Layout = ({ children, auth }) => {
  return (
    <div className="flex flex-col h-[100vh]">
      <Head>
        <title>Trackify</title>
      </Head>

      <MenuBar name={auth.user.displayName} />
      <div className="flex h-full bg-second">
        <Sidebar logout={auth.logout} />
        <div className="flex flex-col w-full p-4 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
