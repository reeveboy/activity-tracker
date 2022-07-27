import MenuBar from "../components/MenuBar/MenuBar";
import Sidebar from "../components/Sidebar/Sidebar";
import Modal from "../components/Modal";
import { withProtected } from "../src/hooks/route";
import {
  collection,
  deleteDoc,
  doc,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { app } from "../src/config/firebase.config";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Layout from "../components/Layout/Layout";

const Customers = ({ auth }) => {
  const db = getFirestore(app);

  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "customers"), orderBy("customerName"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const custs = [];
      snapshot.forEach((doc) => {
        custs.push({ id: doc.id, ...doc.data() });
      });
      setCustomers(custs);
    });
    return unsubscribe;
  }, []);

  const [modalOpen, setModalOpen] = useState(false);

  const close = () => setModalOpen(false);
  const open = () => setModalOpen(true);

  const [nameField, setNameField] = useState("");

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const editClose = () => setEditModalOpen(false);
  const editOpen = (cust) => {
    setNewNameField(cust.customerName);
    setEditModalOpen(true);
    setSelectedCustomer(cust);
  };

  const handleChange = (e) => {
    setNameField(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (nameField.length < 2) return;

    const newCustRef = doc(collection(db, "customers"));
    await setDoc(newCustRef, { customerName: nameField });

    setNameField("");
    close();
  };

  const [newNameField, setNewNameField] = useState("");

  const handleActiveChange = (e) => {
    setNewNameField(e.target.value);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (newNameField.length < 3) return;

    updateDoc(doc(db, "customers", selectedCustomer.id), {
      customerName: newNameField,
    });

    setNewNameField("");
    editClose();
  };

  const deleteCustomer = (cust) => {
    return deleteDoc(doc(db, "customers", cust.id));
  };

  const form = () => {
    return (
      <div>
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <input
            onChange={handleChange}
            className="mt-2 rounded-md bg-white border border-black w-[300px] px-3 py-2"
            type="text"
            placeholder="customer name"
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
            placeholder="customer name"
            value={newNameField}
          />

          <div className="mt-2">
            <button className="py-2 px-5 bg-orange rounded-lg">Add</button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <Layout auth={auth}>
      <div className="flex justify-between">
        <span className="text-xl ">Customers</span>
        <button
          onClick={() => (modalOpen ? close() : open())}
          className="py-2 px-3 bg-orange rounded-lg hover:scale-105 transition-all">
          Add new Customer
        </button>
      </div>

      <table className="mt-4 table-auto border border-slate-600 rounded-lg bg-white">
        <thead>
          <tr className="text-left text-lg bg-slate-200 border-b border-slate-500">
            <td className="py-3 px-4">Customer</td>
            <td></td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer, idx) => (
            <tr key={idx} className="text-left border-b border-slate-500">
              <td className="py-3 px-4">{customer.customerName}</td>
              <td>
                <button
                  title="edit"
                  onClick={() => {
                    editOpen(customer);
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
                  onClick={() => deleteCustomer(customer)}>
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

export default withProtected(Customers);
