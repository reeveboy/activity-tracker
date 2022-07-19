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
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { app } from "../src/config/firebase.config";
import Typeahead from "../components/Typeahead";
import Stopwatch from "react-stopwatch";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

const Home = ({ auth }) => {
  const { user } = auth;

  const db = getFirestore(app);

  const [plannedTasks, setPlannedTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [description, setDescription] = useState("");
  const [hrsPlanned, setHrsPlanned] = useState(null);

  const [showTimer, setShowTimer] = useState(false);

  const [activeTask, setActiveTask] = useState(null);

  const d = new Date();
  const [date, setDate] = useState(getToday(d));
  const [week, setWeek] = useState(
    getWeek(d.getFullYear(), d.getMonth(), d.getDate())
  );

  const configureDateAndWeek = (d) => {
    setWeek(getWeek(d.getFullYear(), d.getMonth(), d.getDate()));
    setDate(getToday(d));
  };

  const fetchDayTasks = () => {
    const q = query(
      collection(db, "planned_tasks"),
      where("userId", "==", user.uid),
      where("day", "==", date)
    );

    onSnapshot(q, (snapshot) => {
      let tsks = [];
      snapshot.forEach((doc) => {
        tsks.push({ id: doc.id, ...doc.data() });
      });
      setPlannedTasks(tsks);
    });
  };

  useEffect(() => {
    fetchDayTasks();
  }, [date, week]);

  useEffect(() => {
    configureDateAndWeek(new Date());

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

    onSnapshot(collection(db, "tasks"), (snapshot) => {
      let tsks = [];
      snapshot.forEach((doc) => {
        tsks.push(doc.data());
      });
      setTasks(tsks);
    });
  }, []);

  const calcHrs = () => {
    let total = 0;
    plannedTasks.forEach((task) => {
      total += parseInt(task.plannedHrs);
    });
    return total;
  };

  const [stopWatchParams, setStopWatchParams] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const handleStartActiveTask = (task) => {
    setActiveTask(task);
    setShowTimer(true);
    let time = [];
    task.actualHrs.split(":").forEach((n) => {
      time.push(parseInt(n));
    });
    setStopWatchParams({ hours: time[0], minutes: time[1], seconds: time[2] });
  };

  const handleStopActiveTask = (time) => {
    updateDoc(doc(db, "planned_tasks", activeTask.id), {
      actualHrs: time,
    });
    setActiveTask(null);
    setShowTimer(false);
  };

  const onDateChange = (e) => {
    const newDate = new Date(e.target.value);

    configureDateAndWeek(newDate);
    setShowTimer(false);
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
      actualHrs: "00:00:00",
      actualScs: 0,
      timeCreated: serverTimestamp(),
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
      <div className="w-[700px]">
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
            className="mt-4 rounded-md bg-white border border-black w-full px-3 py-2"
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
            className="mt-4 rounded-md bg-white border border-black w-full px-3 py-2"
            type="text"
            placeholder="description"
            onChange={handleDescriptionChange}
          />
          <input
            className="mt-4 rounded-md bg-white border border-black w-full px-3 py-2"
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
        <span className="text-3xl font-bold">Week {week}</span>
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

      {showTimer ? (
        <div className="mt-4 bg-rose-100 w-full py-4 px-3 rounded-md flex justify-between items-center">
          <span className="text-2xl">{activeTask.projectCode}</span>
          <div className="flex items-center">
            <span className="text-2xl mr-2">{activeTask.task}</span>
            <OverlayTrigger
              placement="right"
              overlay={
                <Tooltip>
                  <span>{activeTask.description}</span>
                </Tooltip>
              }>
              <button className="">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  fill="currentColor"
                  className="bi bi-info-circle"
                  viewBox="0 0 16 16">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                  <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                </svg>
              </button>
            </OverlayTrigger>
          </div>
          <div className="flex items-center">
            <Stopwatch
              seconds={stopWatchParams.seconds}
              minutes={stopWatchParams.minutes}
              hours={stopWatchParams.hours}
              autoStart={showTimer}
              render={({ formatted }) => {
                return (
                  <>
                    <span className="text-4xl">{formatted}</span>
                    <button
                      onClick={() => handleStopActiveTask(formatted)}
                      className="bg-red-500 px-3 py-2 text-white rounded-md ml-4">
                      Stop
                    </button>
                  </>
                );
              }}
            />
          </div>
        </div>
      ) : (
        ""
      )}

      <div className="mt-4 flex justify-between">
        <select
          defaultValue={"You"}
          className="rounded-md px-4 py-2 w-[200px] border-none bg-white"
          name="user"
          id="select_user">
          <option value="You">You</option>
        </select>
        <button
          onClick={() => (modalOpen ? close() : open())}
          className="py-2 px-3 bg-orange rounded-lg">
          Add Task
        </button>
      </div>

      <table className="mt-4 table-auto border border-slate-600 rounded-lg bg-white">
        <thead>
          <tr className="text-left text-lg border-b bg-slate-200  border-slate-500">
            <th className="py-3 px-4 ">Category</th>
            <th>Project Code</th>
            <th>Customer</th>
            <th>Task</th>
            <th className="text-center">Planned Hrs</th>
            <th className="text-center">Actual Hrs</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {plannedTasks.map((tsk, idx) => (
            <tr key={idx} className="text-left border-b border-slate-500">
              <td className="py-3 px-4">{tsk.category}</td>
              <td>{tsk.projectCode}</td>
              <td>{tsk.customer}</td>
              <td className="truncate overflow-hidden">
                <div className="flex items-center">
                  <span>{tsk.task}</span>
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip>
                        <span>{tsk.description}</span>
                      </Tooltip>
                    }>
                    <button className="ml-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="currentColor"
                        class="bi bi-info-circle"
                        viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                        <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                      </svg>
                    </button>
                  </OverlayTrigger>
                </div>
              </td>
              <td className="text-center">{tsk.plannedHrs}</td>
              <td className="text-center">{tsk.actualHrs}</td>
              <td>
                {tsk == activeTask ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xlink="http://www.w3.org/1999/xlink"
                    aria-hidden="true"
                    role="img"
                    width="30"
                    height="30"
                    preserveAspectRatio="xMidYMid meet"
                    viewBox="0 0 1024 1024">
                    <path
                      fill="black"
                      d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448s448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372s372 166.6 372 372s-166.6 372-372 372zm-88-532h-48c-4.4 0-8 3.6-8 8v304c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V360c0-4.4-3.6-8-8-8zm224 0h-48c-4.4 0-8 3.6-8 8v304c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V360c0-4.4-3.6-8-8-8z"
                    />
                  </svg>
                ) : (
                  <button onClick={() => handleStartActiveTask(tsk)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      xlink="http://www.w3.org/1999/xlink"
                      aria-hidden="true"
                      role="img"
                      width="30"
                      height="30"
                      preserveAspectRatio="xMidYMid meet"
                      viewBox="0 0 1024 1024">
                      <path
                        fill="black"
                        d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448s448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372s372 166.6 372 372s-166.6 372-372 372z"
                      />
                      <path
                        fill="black"
                        d="m719.4 499.1l-296.1-215A15.9 15.9 0 0 0 398 297v430c0 13.1 14.8 20.5 25.3 12.9l296.1-215a15.9 15.9 0 0 0 0-25.8zm-257.6 134V390.9L628.5 512L461.8 633.1z"
                      />
                    </svg>
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 text-right text-2xl">
        <span>Hrs Completed = </span>
        <span className="text-3xl">0 / {calcHrs()}</span>
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
