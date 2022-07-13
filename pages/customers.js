import MenuBar from "../components/MenuBar/MenuBar";
import Sidebar from "../components/Sidebar/Sidebar";
import Modal from "../components/Modal";
import { withProtected } from "../src/hooks/route";
import {
  collection,
  doc,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import { app } from "../src/config/firebase.config";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";

const Customers = ({ auth }) => {
  const { user } = auth;

  const db = getFirestore(app);

  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "customers"), orderBy("customerName"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const custs = [];
      snapshot.forEach((doc) => {
        custs.push(doc.data());
      });
      setCustomers(custs);
    });
    return unsubscribe;
  }, []);

  const [modalOpen, setModalOpen] = useState(false);

  const close = () => setModalOpen(false);
  const open = () => setModalOpen(true);

  const [nameField, setNameField] = useState("");

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

  return (
    <div className="flex flex-col h-[100vh]">
      <MenuBar name={user.displayName} />
      <div className="flex h-full bg-second">
        <Sidebar />
        <div className="flex flex-col w-full p-4 overflow-y-auto">
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
              </tr>
            </thead>
            <tbody>
              {customers.map((customer, idx) => (
                <tr key={idx} className="text-left border-b border-slate-500">
                  <td className="py-3 px-4">{customer.customerName}</td>
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

export default withProtected(Customers);
