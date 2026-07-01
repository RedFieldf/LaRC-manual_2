import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";

// Firebase SDK をグローバルへ橋渡しする（既存アプリのデータフローを維持）。
const firebaseConfig = {
  apiKey: "AIzaSyAU02VkWid0YqFxj2t7saBfmTH7oEYOshc",
  authDomain: "cell-manual.firebaseapp.com",
  projectId: "cell-manual",
  storageBucket: "cell-manual.firebasestorage.app",
  messagingSenderId: "488469326630",
  appId: "1:488469326630:web:5703fe9fc84fb1c64a6fe7",
  measurementId: "G-9MC4FZXEEH",
};
window.__firebase_config = JSON.stringify(firebaseConfig);
window.__app_id = "cell-manual-reservation";
window.firebaseModules = {
  initializeApp,
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  where,
};
