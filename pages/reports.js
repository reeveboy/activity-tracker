import {
  collection,
  getFirestore,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import { app } from "../src/config/firebase.config";
import { withProtected } from "../src/hooks/route";

const Reports = ({ auth }) => {
  const db = getFirestore(app);

  const [tasks, setTasks] = useState([]);
  const [doughData, setDoughData] = useState({ totalHrs: 0 });

  useEffect(() => {
    const q = query(
      collection(db, "planned_tasks"),
      where("userId", "==", auth.user.uid)
    );

    const tsks = [];
    onSnapshot(q, (snapshot) => {
      const start = new Date("2022-07-01");
      const end = new Date("2022-07-31");

      snapshot.forEach((doc) => {
        const data = doc.data();
        const docDate = new Date(data.day);

        if (docDate >= start && docDate <= end) {
          tsks.push({ id: doc.id, ...data });
        }
      });
      setTasks(tsks);

      let total = 0;
      tsks.forEach((tsk) => {
        if (!tsk?.roundedHrs) return;
        total = total + parseFloat(tsk.roundedHrs);
      });
      setDoughData({ totalHrs: total });
    });
  }, []);

  return <Layout auth={auth}>Reports {doughData.totalHrs}</Layout>;
};

export default withProtected(Reports);
