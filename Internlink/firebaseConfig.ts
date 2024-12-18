import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyB3AY6PO13D0J1twqo7bbA9syPImSSK24U",
  authDomain: "internlink-7b957.firebaseapp.com",
  projectId: "internlink-7b957",
  storageBucket: "internlink-7b957.firebasestorage.app",
  messagingSenderId: "131236590681",
  appId: "1:131236590681:web:d7422d5fa015adcfe6ad48"
};

const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const db = getFirestore(app); 
export const storage = getStorage(app); 

export default app;
