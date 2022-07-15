import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import MenuBar from "../components/MenuBar/MenuBar";
import Sidebar from "../components/Sidebar/Sidebar";
import Modal from "../components/Modal";
import { withProtected } from "../src/hooks/route";
import {
  collection,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import { app } from "../src/config/firebase.config";
import Typeahead from "../components/Typeahead";
import Layout from "../components/Layout/Layout";

const Projects = ({ auth }) => {
  const { user } = auth;

  const db = getFirestore(app);

  const [projects, setProjects] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [projectField, setProjectField] = useState("");

  const newProjectRef = doc(collection(db, "projects"));

  useEffect(() => {
    const q = query(collection(db, "projects"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let projs = [];
      snapshot.forEach((doc) => {
        projs.push({ id: doc.id, ...doc.data() });
      });
      setProjects(projs);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const customerRef = collection(db, "customers");

    const unsubscribe = onSnapshot(customerRef, (snapshot) => {
      const custs = [];
      snapshot.forEach((doc) => {
        custs.push({ customerId: doc.id, ...doc.data() });
      });
      setCustomers(custs);
    });

    return unsubscribe;
  }, []);

  const handleChange = (e) => {
    setProjectField(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (projectField.length < 2) return;
    if (!selected) return;

    await setDoc(newProjectRef, {
      projectCode: projectField,
      customerName: selected[0].customerName,
    });

    setProjectField("");
    setSelected(null);
    close();
  };

  const [modalOpen, setModalOpen] = useState(false);

  const close = () => setModalOpen(false);
  const open = () => setModalOpen(true);

  const form = () => {
    return (
      <div>
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <input
            onChange={handleChange}
            className="mt-2 rounded-md bg-white border border-black w-[300px] px-3 py-2"
            type="text"
            placeholder="project code"
          />

          <Typeahead
            items={customers}
            setSelected={setSelected}
            field={"customerName"}
            placeholder={"customer"}
            len={1}
          />

          <div className="mt-2">
            <button className="py-2 px-5 bg-orange rounded-lg">Add</button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <Layout user={user}>
      <div className="flex justify-between">
        <span className="text-xl ">Projects</span>
        <button
          onClick={() => (modalOpen ? close() : open())}
          className="py-2 px-3 bg-orange rounded-lg hover:scale-105 transition-all">
          Add new Project
        </button>
      </div>

      <table className="mt-4 table-auto border border-slate-600 rounded-lg bg-white">
        <thead>
          <tr className="text-left text-lg bg-slate-200 border-b border-slate-500">
            <td className="py-3 px-4">Project</td>
            <td className="">Customer</td>
          </tr>
        </thead>
        <tbody>
          {projects.map((project, idx) => (
            <tr key={idx} className="text-left border-b border-slate-500">
              <td className="py-3 px-4">{project.projectCode}</td>
              <td className="">{project.customerName}</td>
            </tr>
          ))}
        </tbody>
      </table>

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

export default withProtected(Projects);
