import Layout from "../components/Layout/Layout";
import MenuBar from "../components/MenuBar/MenuBar";
import Sidebar from "../components/Sidebar/Sidebar";
import { withProtected } from "../src/hooks/route";

const Team = ({ auth }) => {
  const { user } = auth;

  return <Layout user={user}>Teams</Layout>;
};

export default withProtected(Team);
