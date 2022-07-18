import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import { withProtected } from "../src/hooks/route";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
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

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const editClose = () => setEditModalOpen(false);
  const editOpen = (proj) => {
    setNewCodeField(proj.projectCode);
    setEditModalOpen(true);
    setSelectedProject(proj);
  };

  const close = () => setModalOpen(false);
  const open = () => setModalOpen(true);

  const [newCodeField, setNewCodeField] = useState("");
  const [newCustomerField, setNewCustomerField] = useState("");

  const handleActiveChange = (e) => {
    setNewCodeField(e.target.value);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (newCodeField.length < 3) return;

    updateDoc(doc(db, "projects", selectedProject.id), {
      projectCode: newCodeField,
      customerName: newCustomerField[0].customerName,
    });

    setNewCodeField("");
    editClose();
  };

  const deleteProject = (proj) => {
    return deleteDoc(doc(db, "projects", proj.id));
  };

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

  const editForm = () => {
    return (
      <div>
        <form onSubmit={handleUpdate} className="flex flex-col items-center">
          <input
            onChange={handleActiveChange}
            className="mt-2 rounded-md bg-white border border-black w-[300px] px-3 py-2"
            type="text"
            placeholder="project code"
            value={newCodeField}
          />

          <Typeahead
            items={customers}
            setSelected={setNewCustomerField}
            field={"customerName"}
            placeholder={selectedProject.customerName}
            len={0}
          />

          <div className="mt-2">
            <button className="py-2 px-5 bg-orange rounded-lg">Update</button>
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
            <td></td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {projects.map((project, idx) => (
            <tr key={idx} className="text-left border-b border-slate-500">
              <td className="py-3 px-4">{project.projectCode}</td>
              <td className="">{project.customerName}</td>
              <td>
                <button
                  title="edit"
                  onClick={() => {
                    editOpen(project);
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
              <td>
                <button
                  className=""
                  title="delete"
                  onClick={() => deleteProject(project)}>
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

export default withProtected(Projects);
