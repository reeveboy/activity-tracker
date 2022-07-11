import MenuBar from "../components/MenuBar/MenuBar";
import Sidebar from "../components/Sidebar/Sidebar";
import { withProtected } from "../src/hooks/route";

const Reports = ({ auth }) => {
  const { user } = auth;

  return (
    <div className="flex flex-col h-[100vh]">
      <MenuBar name={user.displayName} />
      <div className="flex h-full bg-secondary">
        <Sidebar />
        Reports
      </div>
    </div>
  );
};

export default withProtected(Reports);
