import React from "react";

const MenuBar = () => {
  return (
    <div className="flex w-full h-[60px] items-center justify-between p-4 bg-primary bg-[url('/banner.png')]">
      <span className="text-2xl text-white font-medium">
        OPTEL Time Tracking
      </span>
      <div className="flex items-center">
        <span className="text-lg text-white mr-3">John Doe</span>
        <div className="bg-green w-[40px] h-[40px] rounded-[999px] flex justify-center items-center">
          <span className="text-white text-lg font-bold">JD</span>
        </div>
      </div>
    </div>
  );
};

export default MenuBar;
