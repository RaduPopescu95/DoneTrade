// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getStorage, ref, uploadBytes } from "firebase/storage";

// import * as firebase from "firebase";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBR3zAeAu4ufuQ7Xf9WfVYs2HfKzWajifE",
  authDomain: "donetrade.firebaseapp.com",
  projectId: "donetrade",
  storageBucket: "donetrade.appspot.com",
  messagingSenderId: "15041053531",
  appId: "1:15041053531:web:a5c0bc0897e9ad60bad07e",
  measurementId: "G-QQE1LEFZFN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//Auth
const authentication = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

//Storage
const storage = getStorage(app);

export { db, authentication, storage };
