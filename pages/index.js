import MenuBar from "../components/MenuBar/MenuBar";
import Sidebar from "../components/Sidebar/Sidebar";
import Tracker from "../components/Tracker/Tracker";
import { withProtected } from "../src/hooks/route";

const Home = ({ auth }) => {
  const { user } = auth;
  return (
    <div className="flex flex-col h-[100vh]">
      <MenuBar name={user.displayName} />
      <div className="flex h-full bg-second">
        <Sidebar />
        <Tracker />
      </div>
    </div>
  );
};

export default withProtected(Home);
