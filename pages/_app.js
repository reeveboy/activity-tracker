import "../src/config/firebase.config";
import Head from "../components/Head/Head";
import { AuthProvider } from "../src/hooks/auth";
import AuthStateChanged from "../src/layout/AuthStateChanged";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <AuthStateChanged>
        <Component {...pageProps} />
      </AuthStateChanged>
    </AuthProvider>
  );
}

export default MyApp;
