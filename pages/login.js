import React from "react";
import { withPublic } from "../src/hooks/route";

const Login = ({ auth }) => {
  const { loginWithGoogle, error } = auth;

  if (error) {
    console.log(error);
  }

  return (
    <div className="w-full h-screen flex justify-center items-center bg-secondary">
      <div className="flex flex-col p-8 rounded-lg items-center bg-white">
        <span className="text-2xl">OPTEL Time Tracker</span>
        <button
          className="mt-4 border px-5 py-3 flex items-center"
          onClick={loginWithGoogle}>
          <img src="/google.png" height={50} width={50} alt="" />
          <span className="ml-2 text-lg">Sign in with Google</span>
        </button>
      </div>
    </div>
  );
};

export default withPublic(Login);
