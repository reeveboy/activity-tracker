import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { doc, getFirestore, onSnapshot, setDoc } from "firebase/firestore";
import { app } from "../config/firebase.config";

const auth = getAuth();
const db = getFirestore(app);

export const AuthService = {
  loginWithGoogle: async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);

      const { user } = result;

      const userRef = doc(db, `users/${user.uid}`);
      onSnapshot(userRef, (snapshot) => {
        if (!snapshot.exists()) {
          setDoc(userRef, {
            displayName: user.displayName,
            email: user.email,
          });
        }
      });

      return {
        user: result.user,
      };
    } catch (e) {
      return {
        error: e.message,
      };
    }
  },

  logout: () => {
    signOut(auth);
  },
};
