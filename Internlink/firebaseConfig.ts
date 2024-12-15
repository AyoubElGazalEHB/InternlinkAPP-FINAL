import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyC_ImRhKfHYSpf2GExzQ2__yqyrfjBlKFk",
  authDomain: "internlink-c1eae.firebaseapp.com",
  projectId: "internlink-c1eae",
  storageBucket: "internlink-c1eae.appspot.com",
  messagingSenderId: "882823245148",
  appId: "882823245148:web:61459468157edbdaaba599",
};

const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const db = getFirestore(app); 
export const storage = getStorage(app); 

export default app;
