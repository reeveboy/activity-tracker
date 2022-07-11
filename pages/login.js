import React from "react";
import { withPublic } from "../src/hooks/route";

const Login = ({ auth }) => {
  const { user, loginWithGoogle, error } = auth;

  return (
    <div>
      {error && <span>{error}</span>}
      <button onClick={loginWithGoogle}>Login with Google</button>
      {user && <span>{user.uid}</span>}
    </div>
  );
};

export default withPublic(Login);
