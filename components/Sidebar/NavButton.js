import { useRouter } from "next/router";
import React from "react";

const NavButton = ({ svg, name }) => {
  const router = useRouter();
  let check = false;
  if (
    router.pathname.slice(1) == name.toLowerCase() ||
    (router.pathname == "/" && name == "Tracker")
  ) {
    check = true;
  }
  const handleClick = () => {
    if (name == "Tracker") {
      router.push("/");
      return;
    }
    router.push(`/${name.toLowerCase()}`);
  };
  if (check) {
    return (
      <button
        onClick={handleClick}
        className="py-4 px-2 border-b border-r-4 bg-gray-100 border-primary flex items-center hover:bg-gray-300">
        {svg}
        <span className="text-lg ml-4">{name}</span>
      </button>
    );
  }
  return (
    <button
      onClick={handleClick}
      className="py-4 px-2 border-b border-black flex items-center hover:bg-gray-300">
      {svg}
      <span className="text-lg ml-4">{name}</span>
    </button>
  );
};

export default NavButton;
