import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDlw_tk53acETRBwNhPnxQUzVBIwmdbiuk",
  authDomain: "arena-wars-auth.firebaseapp.com",
  projectId: "arena-wars-auth",
  storageBucket: "arena-wars-auth.firebasestorage.app",
  messagingSenderId: "801870883004",
  appId: "1:801870883004:web:0dfa029e9d14684a75c8b9",
  measurementId: "G-SEWHK7RKFD"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const token = await result.user.getIdToken();
    return { user: result.user, token };
  } catch (error) {
    console.error("Firebase Auth Error:", error);
    throw error;
  }
};
