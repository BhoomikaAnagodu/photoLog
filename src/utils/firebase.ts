import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC_YGX1gCNQ7ILjnlIToNYl0YDEihLTG0w",
  authDomain: "photolog-873f8.firebaseapp.com",
  projectId: "photolog-873f8",
  storageBucket: "photolog-873f8.firebasestorage.app",
  messagingSenderId: "59201216267",
  appId: "1:59201216267:web:902e1763dcbef1019d0c0e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
