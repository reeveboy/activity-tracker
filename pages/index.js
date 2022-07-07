import MenuBar from "../components/MenuBar/MenuBar";
import Sidebar from "../components/Sidebar/Sidebar";
import Tracker from "../components/Tracker/Tracker";

export default function Home() {
  return (
    <div className="flex flex-col">
      <MenuBar />
      <div className="flex">
        <Sidebar />
        <Tracker />
      </div>
    </div>
  );
}
