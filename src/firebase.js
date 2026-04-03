import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDAwiHZLSedNFwfchehfN4ADt6EEQNrfDs",
  authDomain: "goodwordsclub-3e27f.firebaseapp.com",
  databaseURL:
    "https://goodwordsclub-3e27f-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "goodwordsclub-3e27f",
  storageBucket: "goodwordsclub-3e27f.firebasestorage.app",
  messagingSenderId: "352915939024",
  appId: "1:352915939024:web:b2623596888272595388d5",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
