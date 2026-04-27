import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDW8YQeLJOoSfSqewaDuXxIZFMGg6OaWuM",
  authDomain: "crmex-e0f9c.firebaseapp.com",
  projectId: "crmex-e0f9c",
  storageBucket: "crmex-e0f9c.firebasestorage.app",
  messagingSenderId: "491487882128",
  appId: "1:491487882128:web:de0efbff143566847e2115",
  measurementId: "G-LH4H9MWY2W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
