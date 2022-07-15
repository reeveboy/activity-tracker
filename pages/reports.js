import Layout from "../components/Layout/Layout";
import MenuBar from "../components/MenuBar/MenuBar";
import Sidebar from "../components/Sidebar/Sidebar";
import { withProtected } from "../src/hooks/route";

const Reports = ({ auth }) => {
  const { user } = auth;

  return <Layout user={user}>Reports</Layout>;
};

export default withProtected(Reports);
