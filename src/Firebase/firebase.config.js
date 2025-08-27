// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA3dtFkEDXGJUgBn5RBODFO9nhdptDAtkg",
  authDomain: "my-react-app-20ccd.firebaseapp.com",
  projectId: "my-react-app-20ccd",
  storageBucket: "my-react-app-20ccd.firebasestorage.app",
  messagingSenderId: "567683748181",
  appId: "1:567683748181:web:b3e6cd3f9816967b5f1fdc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);