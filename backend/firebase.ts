import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD7kUIPanf3VjUt_eSrjswq6-OKRM2FinQ",
  authDomain: "attendance-46248.firebaseapp.com",
  projectId: "attendance-46248",
  storageBucket: "attendance-46248.firebasestorage.app",
  messagingSenderId: "1023910446613",
  appId: "1:1023910446613:web:1dc4492a98599e7740301c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth(app);

export { app, auth, db };