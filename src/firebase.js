import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyC4DR8ESHLmNxFMwtIA98wU1nOUoDj0CMM",
  authDomain: "goodwordsclub-3f3be.firebaseapp.com",
  databaseURL:
    "https://goodwordsclub-3f3be-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "goodwordsclub-3f3be",
  storageBucket: "goodwordsclub-3f3be.appspot.com",
  messagingSenderId: "807553735253",
  appId: "1:807553735253:web:1c37c13d3e585c8c9b92dc",
  measurementId: "G-1X4PKRWBG0",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
