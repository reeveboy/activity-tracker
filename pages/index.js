import { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import { withProtected } from "../src/hooks/route";
import { AnimatePresence } from "framer-motion";
import Modal from "../components/Modal";
import { getToday } from "../utils/getToday";
import { getWeek } from "../utils/getWeek";
import {
  collection,
  doc,
  getFirestore,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { app } from "../src/config/firebase.config";
import Typeahead from "../components/Typeahead";

const Home = ({ auth }) => {
  const { user } = auth;

  const db = getFirestore(app);

  const [plannedTasks, setPlannedTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [projects, setProjects] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [description, setDescription] = useState("");
  const [hrsPlanned, setHrsPlanned] = useState(null);

  const d = new Date();
  const [date, setDate] = useState(getToday(d));
  const [week, setWeek] = useState("");

  const configureDateAndWeek = (d) => {
    setWeek(getWeek(d.getFullYear(), d.getMonth(), d.getDate()));
    setDate(getToday(d));
  };

  useEffect(() => {
    configureDateAndWeek(new Date());
    const q = query(
      collection(db, "planned_tasks"),
      where("userId", "==", user.uid),
      where("day", "==", date)
    );

    onSnapshot(q, (snapshot) => {
      let tsks = [];
      snapshot.forEach((doc) => {
        tsks.push(doc.data());
      });
      setPlannedTasks(tsks);
    });

    onSnapshot(collection(db, "categories"), (snapshot) => {
      let cats = [];
      snapshot.forEach((doc) => {
        cats.push(doc.data());
      });
      setCategories(cats);
    });

    onSnapshot(collection(db, "projects"), (snapshot) => {
      let prjs = [];
      snapshot.forEach((doc) => {
        prjs.push(doc.data());
      });
      setProjects(prjs);
    });

    onSnapshot(collection(db, "customers"), (snapshot) => {
      let custs = [];
      snapshot.forEach((doc) => {
        custs.push(doc.data());
      });
      setCustomers(custs);
    });

    onSnapshot(collection(db, "tasks"), (snapshot) => {
      let tsks = [];
      snapshot.forEach((doc) => {
        tsks.push(doc.data());
      });
      setTasks(tsks);
    });
  }, []);

  const onDateChange = (e) => {
    const newDate = new Date(e.target.value);

    configureDateAndWeek(newDate);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };
  const handleHrsPlannedChange = (e) => {
    setHrsPlanned(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      userId: user.uid,
      day: date,
      category: selectedCategory[0].categoryName,
      projectCode: selectedProject[0].projectCode,
      customer: selectedProject[0].customerName,
      task: selectedTask[0].taskName,
      description: description,
      plannedHrs: hrsPlanned,
    };
    await setDoc(doc(collection(db, "planned_tasks")), data);

    setCategories(null);
    setProjects(null);
    setTasks(null);
    setDescription(null);
    setHrsPlanned(null);

    close();
  };

  const [modalOpen, setModalOpen] = useState(false);

  const close = () => setModalOpen(false);
  const open = () => setModalOpen(true);

  const form = () => {
    return (
      <div>
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <Typeahead
            items={categories}
            setSelected={setSelectedCategory}
            field={"categoryName"}
            placeholder={"category"}
            len={0}
          />
          <Typeahead
            items={projects}
            setSelected={setSelectedProject}
            field={"projectCode"}
            placeholder={"project"}
            len={1}
          />
          <input
            className="mt-4 rounded-md bg-white border border-black w-[300px] px-3 py-2"
            type="text"
            value={selectedProject ? selectedProject[0].customerName : ""}
            placeholder="customer"
            disabled
          />
          <Typeahead
            items={tasks}
            setSelected={setSelectedTask}
            field={"taskName"}
            placeholder={"task"}
            len={0}
          />
          <input
            className="mt-4 rounded-md bg-white border border-black w-[300px] px-3 py-2"
            type="text"
            placeholder="description"
            onChange={handleDescriptionChange}
          />
          <input
            className="mt-4 rounded-md bg-white border border-black w-[300px] px-3 py-2"
            type="number"
            placeholder="hrs planned"
            onChange={handleHrsPlannedChange}
            required
          />
          <button
            type="submit"
            className="mt-4 w-full py-2 px-5 bg-orange rounded-lg">
            Add
          </button>
        </form>
      </div>
    );
  };
  return (
    <Layout user={user}>
      <div className="flex items-center">
        <span className="mr-3 text-xl font-bold">Week {week}</span>
      </div>
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center ">
          <input
            className="py-3 px-4 rounded-md"
            type="date"
            value={date}
            onChange={onDateChange}
          />
        </div>
        <div></div>
      </div>
      <div className="mt-4 flex justify-between">
        <select
          defaultValue={"You"}
          className="rounded-md px-4 py-2 w-[200px] border-none bg-white"
          name="user"
          id="select_user">
          <option value="You">You</option>
          <option value="Donovan">Donovan</option>
        </select>
        <button
          onClick={() => (modalOpen ? close() : open())}
          className="py-2 px-3 bg-orange rounded-lg">
          Add Task
        </button>
      </div>

      <table className="mt-4 table-auto border border-slate-600 rounded-lg bg-white">
        <thead>
          <tr className="text-left text-lg border-b border-slate-500">
            <th className="py-3 px-4">Category</th>
            <th>Project Code</th>
            <th>Customer</th>
            <th>Task</th>
            <th>Planned Hrs</th>
            <th>Actual Hrs</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {plannedTasks.map((tsk, idx) => (
            <tr key={idx} className="text-left border-b border-slate-500">
              <td className="py-3 px-4">{tsk.category}</td>
              <td>{tsk.projectCode}</td>
              <td>{tsk.customer}</td>
              <td>{tsk.task}</td>
              <td>{tsk.plannedHrs}</td>
              <td>{tsk.actualHrs}</td>
              <td>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  role="img"
                  width="25"
                  height="25"
                  preserveAspectRatio="xMidYMid meet"
                  viewBox="0 0 36 36">
                  <path
                    fill="black"
                    d="M8.07 31.6A2.07 2.07 0 0 1 6 29.53V6.32a2.07 2.07 0 0 1 3-1.85l23.21 11.61a2.07 2.07 0 0 1 0 3.7L9 31.38a2.06 2.06 0 0 1-.93.22Zm0-25.34L8 6.32v23.21l.1.06L31.31 18a.06.06 0 0 0 0-.06Z"
                    className="clr-i-outline clr-i-outline-path-1"
                  />
                  <path fill="none" d="M0 0h36v36H0z" />
                </svg>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 text-right">
        <span>Hrs Completed = </span>
        <span className="text-lg">2.0 / 37.5</span>
      </div>

      <AnimatePresence
        initial={false}
        onExitComplete={() => null}
        exitBeforeEnter={true}>
        {modalOpen && (
          <Modal handleClose={close} modalOpen={modalOpen} text={form()} />
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default withProtected(Home);
