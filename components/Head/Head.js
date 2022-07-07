import React from "react";
import NextHead from "next/head";

const Head = ({ children }) => {
  return (
    <div>
      <NextHead>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&display=swap"
          rel="stylesheet"
        />
      </NextHead>
      {children}
    </div>
  );
};

export default Head;
