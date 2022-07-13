import "../src/config/firebase.config";
import { AuthProvider } from "../src/hooks/auth";
import AuthStateChanged from "../src/layout/AuthStateChanged";
import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-typeahead/css/Typeahead.css";

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
