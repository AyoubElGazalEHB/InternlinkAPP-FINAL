import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage, uploadBytesResumable, ref, getDownloadURL } from "firebase/storage";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB3AY6PO13D0J1twqo7bbA9syPImSSK24U",
  authDomain: "internlink-7b957.firebaseapp.com",
  projectId: "internlink-7b957",
  storageBucket: "internlink-7b957.firebasestorage.app",
  messagingSenderId: "131236590681",
  appId: "1:131236590681:web:d7422d5fa015adcfe6ad48"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase modules for usage
export const auth = getAuth(app); // Authentication module
export const db = getFirestore(app); // Firestore database module
export const storage = getStorage(app); // Storage module

/**
 * Utility function to upload a file to Firebase Storage.
 * @param {string} uri - File URI to be uploaded.
 * @param {string} fileName - The name to save the file as.
 * @param {string} folder - Folder path in Firebase Storage.
 * @param {function} progressCallback - Callback to track upload progress.
 * @returns {Promise<string>} - Returns the file's download URL.
 */
export const uploadToFirebase = async (uri, fileName, folder, progressCallback) => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();

    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated.");

    // Define storage path
    const storageRef = ref(storage, `${folder}/${user.uid}/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, blob);

    // Handle progress and completion
    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          progressCallback?.(progress);
        },
        (error) => reject(error),
        async () => {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadUrl);
        }
      );
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export default app;
