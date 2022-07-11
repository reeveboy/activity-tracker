import React, { useState } from "react";
import NavButton from "./NavButton";
import { useRouter } from "next/router";

const Sidebar = () => {
  const icon_size = 25;

  const links = [
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          role="img"
          width={icon_size}
          height={icon_size}
          preserveAspectRatio="xMidYMid meet"
          viewBox="0 0 100 100">
          <path
            fill="black"
            d="M42 0a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h3v5.295C23.364 15.785 6.5 34.209 6.5 56.5C6.5 80.483 26.017 100 50 100s43.5-19.517 43.5-43.5a43.22 43.22 0 0 0-6.72-23.182l4.238-3.431l1.888 2.332a2 2 0 0 0 2.813.297l3.11-2.518a2 2 0 0 0 .294-2.812L89.055 14.75a2 2 0 0 0-2.813-.297l-3.11 2.518a2 2 0 0 0-.294 2.812l1.889 2.332l-4.22 3.414C73.77 18.891 64.883 14.435 55 13.297V8h3a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H42zm8 20c20.2 0 36.5 16.3 36.5 36.5S70.2 93 50 93S13.5 76.7 13.5 56.5S29.8 20 50 20zm.002 7.443L50 56.5l23.234 17.447a29.056 29.056 0 0 0 2.758-30.433a29.056 29.056 0 0 0-25.99-16.07z"
            color="black"
          />
        </svg>
      ),
      text: "Tracker",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          role="img"
          width={icon_size}
          height={icon_size}
          preserveAspectRatio="xMidYMid meet"
          viewBox="0 0 16 16">
          <path
            fill="black"
            d="M1 3.5A1.5 1.5 0 0 1 2.5 2h7A1.5 1.5 0 0 1 11 3.5v5A1.5 1.5 0 0 1 9.5 10h-7A1.5 1.5 0 0 1 1 8.5v-5ZM2.5 3a.5.5 0 0 0-.5.5v5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5v-5a.5.5 0 0 0-.5-.5h-7Zm2.585 10A1.5 1.5 0 0 0 6.5 14h3A5.5 5.5 0 0 0 15 8.5v-1a1.5 1.5 0 0 0-1-1.415V8.5A4.5 4.5 0 0 1 9.5 13H5.085ZM4.5 12a1.5 1.5 0 0 1-1.415-1H9.5A2.5 2.5 0 0 0 12 8.5V4.085A1.5 1.5 0 0 1 13 5.5v3A3.5 3.5 0 0 1 9.5 12h-5Z"
          />
        </svg>
      ),
      text: "Projects",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          role="img"
          width={icon_size}
          height={icon_size}
          preserveAspectRatio="xMidYMid meet"
          viewBox="0 0 48 48">
          <path
            fill="black"
            fill-rule="evenodd"
            d="M24 26c5.525 0 10-4.475 10-10S29.525 6 24 6s-10 4.475-10 10s4.475 10 10 10Zm8-10c0 4.42-3.58 8-8 8s-8-3.58-8-8s3.58-8 8-8s8 3.58 8 8Zm-2.965 11.874L26 36.544V36l-.575-4.021a1 1 0 0 0 .764-.736l.5-2A1 1 0 0 0 25.72 28h-3.438a1 1 0 0 0-.97 1.242l.5 2a1 1 0 0 0 .764.737l-.562 3.932l-3.054-8.048l-.02-.043a1.48 1.48 0 0 0-1.676-.791c-.341.083-.717.17-1.114.264c-.937.219-1.994.466-2.996.745c-1.413.394-2.877.89-3.894 1.558C7.387 30.826 6 32.453 6 34.5V42h36v-7.5c0-2.047-1.386-3.675-3.26-4.904c-1.016-.668-2.48-1.164-3.893-1.558a75.087 75.087 0 0 0-2.996-.745a127 127 0 0 1-1.114-.264a1.479 1.479 0 0 0-1.675.791l-.027.054Zm2.409 1.378l-.713-.168L26.909 40H40v-5.5c0-1.046-.704-2.147-2.357-3.232c-.734-.483-1.93-.913-3.332-1.303a70.997 70.997 0 0 0-2.866-.713h-.001Zm-14.162-.171L21.425 40H8v-5.5c0-1.046.704-2.147 2.357-3.232c.734-.483 1.93-.913 3.332-1.303a69.997 69.997 0 0 1 2.866-.713l.727-.171Z"
            clip-rule="evenodd"
          />
        </svg>
      ),
      text: "Customers",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          role="img"
          width={icon_size}
          height={icon_size}
          preserveAspectRatio="xMidYMid meet"
          viewBox="0 0 1024 1024">
          <path
            fill="black"
            d="M888 792H200V168c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v688c0 4.4 3.6 8 8 8h752c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm-600-80h56c4.4 0 8-3.6 8-8V560c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v144c0 4.4 3.6 8 8 8zm152 0h56c4.4 0 8-3.6 8-8V384c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v320c0 4.4 3.6 8 8 8zm152 0h56c4.4 0 8-3.6 8-8V462c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v242c0 4.4 3.6 8 8 8zm152 0h56c4.4 0 8-3.6 8-8V304c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v400c0 4.4 3.6 8 8 8z"
          />
        </svg>
      ),
      text: "Reports",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          role="img"
          width={icon_size}
          height={icon_size}
          preserveAspectRatio="xMidYMid meet"
          viewBox="0 0 16 16">
          <path
            fill="black"
            d="M6.002 4a1.998 1.998 0 1 1 3.996 0a1.998 1.998 0 0 1-3.996 0ZM8 3.002a.998.998 0 1 0 0 1.996a.998.998 0 0 0 0-1.996ZM11 4.5a1.5 1.5 0 1 1 3 0a1.5 1.5 0 0 1-3 0Zm1.5-.5a.5.5 0 1 0 0 1a.5.5 0 0 0 0-1Zm-9-1a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0-3ZM3 4.5a.5.5 0 1 1 1 0a.5.5 0 0 1-1 0ZM4.268 7A1.99 1.99 0 0 0 4 8H2v2.5a1.5 1.5 0 0 0 2.096 1.377c.074.331.19.647.34.942A2.5 2.5 0 0 1 1 10.5V8a1 1 0 0 1 1-1h2.268Zm7.296 5.819A2.5 2.5 0 0 0 15 10.5V8a1 1 0 0 0-1-1h-2.268c.17.294.268.635.268 1h2v2.5a1.5 1.5 0 0 1-2.096 1.377c-.075.331-.19.647-.34.942ZM6 6.999a1 1 0 0 0-1 1V11a3 3 0 0 0 6 0V8a1 1 0 0 0-1-1H6Zm0 1h4V11a2 2 0 0 1-4 0V8Z"
          />
        </svg>
      ),
      text: "Team",
    },
  ];

  return (
    <div className="flex flex-col bg-white min-w-[12rem] border-r border-black">
      <NavButton svg={links[0].icon} name={links[0].text} />
      <NavButton svg={links[1].icon} name={links[1].text} />
      <NavButton svg={links[2].icon} name={links[2].text} />
      <NavButton svg={links[3].icon} name={links[3].text} />
      <NavButton svg={links[4].icon} name={links[4].text} />
    </div>
  );
};

export default Sidebar;
