import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Sarah Abdelwahab's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAwkolcIMTYN8SccAjOZhocZk8KkhkjmSI",
  authDomain: "sarahabdelwahab-30634.firebaseapp.com",
  projectId: "sarahabdelwahab-30634",
  storageBucket: "sarahabdelwahab-30634.firebasestorage.app",
  messagingSenderId: "409843299993",
  appId: "1:409843299993:web:2547ba1ae0d32b37b9aa08",
  measurementId: "G-XKNSP94L53"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
