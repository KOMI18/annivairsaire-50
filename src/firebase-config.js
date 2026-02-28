import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyCTnk6YFQ2ksnhHqIuvhCDLijmd0xpjhpQ",
  authDomain: "proejet-firebase.firebaseapp.com",
  databaseURL: "https://proejet-firebase-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "proejet-firebase",
  storageBucket: "proejet-firebase.firebasestorage.app",
  messagingSenderId: "1062216492829",
  appId: "1:1062216492829:web:e9138dd6650a97d45123f4",
  measurementId: "G-TVZ3KG3C55"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);