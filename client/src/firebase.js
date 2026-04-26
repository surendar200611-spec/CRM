import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB5toFk_w0QpD7tSmgMrEcmLSMA6Nptweo",
  authDomain: "excrm-e8183.firebaseapp.com",
  projectId: "excrm-e8183",
  storageBucket: "excrm-e8183.firebasestorage.app",
  messagingSenderId: "415658349027",
  appId: "1:415658349027:web:563d43ca23cd516b6d50d6",
  measurementId: "G-RXHNQ6N7PL"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
