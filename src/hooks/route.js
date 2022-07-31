import { useRouter } from "next/router";
import Loading from "../../components/Loading";
import useAuth from "./auth";

export function withPublic(Component) {
  return function WithPublic(props) {
    const auth = useAuth();
    const router = useRouter();

    if (auth.user) {
      router.replace("/");
      return <Loading />;
    }

    return <Component auth={auth} {...props} />;
  };
}

export function withProtected(Component) {
  return function WithProtected(props) {
    const auth = useAuth();
    const router = useRouter();

    if (!auth.user) {
      router.replace("/login");
      return <Loading />;
    }

    return <Component auth={auth} {...props} />;
  };
}
