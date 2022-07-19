import { useRouter } from "next/router";
import React from "react";
import Link from "next/link";

const NavButton = ({ svg, name }) => {
  const router = useRouter();
  let check = false;
  if (
    router.pathname.slice(1) == name.toLowerCase() ||
    (router.pathname == "/" && name == "Tracker")
  ) {
    check = true;
  }
  const getRoute = () => {
    if (name == "Tracker") {
      return "/";
    }
    return `/${name.toLowerCase()}`;
  };
  if (check) {
    return (
      <Link href={getRoute()}>
        <a className="p-3 text-decoration-none text-black border-b border-r-4 bg-gray-100 border-pri flex items-center hover:bg-gray-300">
          {svg}
          <span className="text-lg ml-4">{name}</span>
        </a>
      </Link>
    );
  }
  return (
    <Link href={getRoute()}>
      <a className="p-3 text-decoration-none text-black border-b border-black flex items-center hover:bg-gray-300">
        {svg}
        <span className="text-lg ml-4">{name}</span>
      </a>
    </Link>
  );
};

export default NavButton;
