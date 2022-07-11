import MenuBar from "../components/MenuBar/MenuBar";
import Sidebar from "../components/Sidebar/Sidebar";
import Tracker from "../components/Tracker/Tracker";
import { withProtected } from "../src/hooks/route";

const Home = () => {
  return (
    <div className="flex flex-col">
      <MenuBar />
      <div className="flex">
        <Sidebar />
        <Tracker />
      </div>
    </div>
  );
};

export default withProtected(Home);
