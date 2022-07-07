import Head from "../components/Head/Head";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <Head>
      <Component {...pageProps} />
    </Head>
  );
}

export default MyApp;
