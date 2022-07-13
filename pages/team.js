import MenuBar from "../components/MenuBar/MenuBar";
import Sidebar from "../components/Sidebar/Sidebar";
import { withProtected } from "../src/hooks/route";

const Team = ({ auth }) => {
  const { user } = auth;

  return (
    <div className="flex flex-col h-[100vh]">
      <MenuBar name={user.displayName} />
      <div className="flex h-full bg-second">
        <Sidebar />
        Team
      </div>
    </div>
  );
};

export default withProtected(Team);
