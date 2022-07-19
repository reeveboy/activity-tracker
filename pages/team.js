import { collection, getFirestore, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import { app } from "../src/config/firebase.config";
import { withProtected } from "../src/hooks/route";

const Team = ({ auth }) => {
  const { user } = auth;

  const db = getFirestore(app);

  const [users, setUsers] = useState([]);

  useEffect(() => {
    onSnapshot(collection(db, "users"), (snapshot) => {
      let usrs = [];
      snapshot.forEach((doc) => {
        usrs.push({ id: doc.id, ...doc.data() });
      });
      setUsers(usrs);
    });
  }, []);

  return (
    <Layout user={user}>
      <span className="text-xl">Teams</span>
      <table className="mt-4 table-auto border border-slate-600 rounded-lg bg-white">
        <thead>
          <tr className="text-left text-lg bg-slate-200 border-b border-slate-500">
            <td className="py-3 px-4">Member</td>
          </tr>
        </thead>
        <tbody>
          {users.map((u, idx) => (
            <tr key={idx} className="text-left border-b border-slate-500">
              <td className="py-3 px-4">{u.displayName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
};

export default withProtected(Team);
