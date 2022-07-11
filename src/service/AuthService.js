import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const auth = getAuth();

export const AuthService = {
  loginWithGoogle: async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
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
