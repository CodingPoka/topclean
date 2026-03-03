import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ⚠️  Replace these values with your Firebase project config
// Go to: https://console.firebase.google.com → Your Project → Project Settings → General → SDK config
const firebaseConfig = {
  apiKey: "AIzaSyAz2HQSjWjlDGzfKMyhihGEPxuZNPG_d0E",
  authDomain: "topclean-e028e.firebaseapp.com",
  projectId: "topclean-e028e",
  storageBucket: "topclean-e028e.firebasestorage.app",
  messagingSenderId: "968672631969",
  appId: "1:968672631969:web:9ca451123155f6f16724e0",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
