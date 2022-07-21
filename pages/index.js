import { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import { withProtected } from "../src/hooks/route";
import { AnimatePresence } from "framer-motion";
import Modal from "../components/Modal";
import { getToday } from "../utils/getToday";
import { getWeek } from "../utils/getWeek";
import {
  collection,
  deleteDoc,
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
import { getRoundedHours } from "../utils/getRoundedHours";

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
    const roundedHrs = getRoundedHours(time);
    updateDoc(doc(db, "planned_tasks", activeTask.id), {
      actualHrs: time,
      roundedHrs,
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
      roundedHrs: "0",
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

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const editClose = () => setEditModalOpen(false);
  const editOpen = (tsk) => {
    // setNewCategory(tsk.category);
    setEditModalOpen(true);
    setEditTask(tsk);
  };

  const [newCategory, setNewCategory] = useState(null);
  const [newProject, setNewProject] = useState(null);

  const handleActiveChange = (e) => {
    // setNewCategory(e.target.value);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!newCategory) return;

    updateDoc(doc(db, "planned_tasks", editTask.id), {
      category: newCategory[0].categoryName,
    });

    setNewCategory(null);
    editClose();
  };

  const deleteTask = (tsk) => {
    return deleteDoc(doc(db, "planned_tasks", tsk.id));
  };

  const editForm = () => {
    return (
      <div className="w-[700px]">
        <form onSubmit={handleUpdate} className="flex flex-col items-center">
          <Typeahead
            items={categories}
            setSelected={setNewCategory}
            field={"categoryName"}
            placeholder={editTask.category}
            len={0}
          />
          <Typeahead
            items={projects}
            setSelected={setNewProject}
            field={"projectCode"}
            placeholder={editTask.projectCode}
            len={1}
          />
          <input
            className="mt-4 rounded-md bg-white border border-black w-full px-3 py-2"
            type="text"
            placeholder="customer"
            value={newProject ? newProject[0].customerName : editTask.customer}
            disabled
          />
          <Typeahead
            items={tasks}
            setSelected={setSelectedTask}
            field={"taskName"}
            placeholder={editTask.task}
            len={0}
          />
          <input
            className="mt-4 rounded-md bg-white border border-black w-full px-3 py-2"
            type="text"
            placeholder="description"
            onChange={handleDescriptionChange}
            value={editTask.description}
          />
          <input
            className="mt-4 rounded-md bg-white border border-black w-full px-3 py-2"
            type="number"
            placeholder="hrs planned"
            value={editTask.plannedHrs}
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
              <button>
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
            <th></th>
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
                  <button>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      class="bi bi-pause-circle"
                      viewBox="0 0 16 16">
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                      <path d="M5 6.25a1.25 1.25 0 1 1 2.5 0v3.5a1.25 1.25 0 1 1-2.5 0v-3.5zm3.5 0a1.25 1.25 0 1 1 2.5 0v3.5a1.25 1.25 0 1 1-2.5 0v-3.5z" />
                    </svg>
                  </button>
                ) : (
                  <button
                    title="start timer"
                    onClick={() => handleStartActiveTask(tsk)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      class="bi bi-play-circle"
                      viewBox="0 0 16 16">
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                      <path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445z" />
                    </svg>
                  </button>
                )}
              </td>
              <td className="mr-2">
                <button
                  title="edit"
                  onClick={() => {
                    editOpen(tsk);
                  }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    class="bi bi-pencil-square"
                    viewBox="0 0 16 16">
                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                    <path
                      fill-rule="evenodd"
                      d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                    />
                  </svg>
                </button>
              </td>
              <td className="mr-2">
                <button
                  className=""
                  title="delete"
                  onClick={() => deleteTask(tsk)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    class="bi bi-trash"
                    viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                    <path
                      fill-rule="evenodd"
                      d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                    />
                  </svg>
                </button>
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

      <AnimatePresence
        initial={false}
        onExitComplete={() => null}
        exitBeforeEnter={true}>
        {editModalOpen && (
          <Modal
            handleClose={editClose}
            modalOpen={editModalOpen}
            text={editForm()}
          />
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default withProtected(Home);
