// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
  UploadTask,
} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGEING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const storage = getStorage(app, "gs://roomrover-e976f.appspot.com");

export type ObserseState = {
  onChange: (percentage: number) => void;
  onError: (error: Error) => void;
  onComplete: (url: string) => void;
};

export const storePhotos = (
  type: "roomads" | "profile",
  file: Blob,
  fileName: string,
  obserseState?: ObserseState
): UploadTask => {
  const storageRef = ref(storage, `${type}/${fileName}`);
  const metadata = { contentType: "image/jpeg" };
  const uploadTask = uploadBytesResumable(storageRef, file, metadata);
  if (obserseState) {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        obserseState.onChange(progress);
      },
      (error) => {
        obserseState.onError(error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        obserseState.onComplete(downloadURL);
      }
    );
  }
  return uploadTask;
};

export const deletePhotos = async (
  type: "roomads" | "profile",
  fileName: string
) => {
  try {
    const storageRef = ref(storage, `${type}/${fileName}`);
    await deleteObject(storageRef);
    return true;
  } catch (error) {
    return false;
  }
};
