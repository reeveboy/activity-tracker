import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import MenuBar from "../components/MenuBar/MenuBar";
import Sidebar from "../components/Sidebar/Sidebar";
import Modal from "../components/Modal";
import { withProtected } from "../src/hooks/route";
import {
  collection,
  getDoc,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { app } from "../src/config/firebase.config";
import CustomerTypeahead from "../components/Typeahead/CustomerTypeahead";

const Projects = ({ auth }) => {
  const { user } = auth;

  const db = getFirestore(app);

  const [projects, setProjects] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selected, setSelected] = useState(null);

  const [loading, setLoading] = useState(true);

  const q = query(collection(db, "projects"));
  const q2 = query(collection(db, "customers"), orderBy("customer_name"));

  useEffect(() => {
    onSnapshot(q, (snapshot) => {
      let projs = [];
      setLoading(true);
      snapshot.forEach(async (doc) => {
        let project = { id: doc.id, ...doc.data() };
        if (project.customerRef) {
          let cust = await getDoc(project.customerRef);
          setLoading(false);
          if (cust.exists()) {
            project = {
              ...project,
              customer: { customer_id: cust.id, ...cust.data() },
            };
          }
        }
        projs.push(project);
      });
      setProjects(projs);
    });

    onSnapshot(q2, (snapshot) => {
      const custs = [];
      snapshot.forEach((doc) => {
        custs.push(doc.data());
      });
      setCustomers(custs);
    });
  }, [setProjects]);

  const [modalOpen, setModalOpen] = useState(false);

  const close = () => setModalOpen(false);
  const open = () => setModalOpen(true);

  const form = () => {
    return (
      <div>
        <form
          // onSubmit={handleSubmit}
          className="flex flex-col items-center">
          <input
            // onChange={handleChange}
            className="mt-2 rounded-md bg-white border border-black w-[300px] px-3 py-2"
            type="text"
            placeholder="project code"
          />

          <CustomerTypeahead items={customers} setSelected={setSelected} />

          <div className="mt-2">
            <button className="py-2 px-5 bg-orange rounded-lg">Add</button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[100vh]">
      <MenuBar name={user.displayName} />
      <div className="flex h-full bg-second">
        <Sidebar />
        <div className="flex flex-col w-full p-4 overflow-y-auto">
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
              {!loading &&
                projects.map((project, idx) => (
                  <tr key={idx} className="text-left border-b border-slate-500">
                    <td className="py-3 px-4">{project.project_code}</td>
                    <td className="">{project?.customer.customer_name}</td>
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
        </div>
      </div>
    </div>
  );
};

export default withProtected(Projects);
