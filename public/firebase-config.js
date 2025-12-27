// firebase-config.js — EGYSÉGES, JAVÍTOTT (NINCS DUPLIKÁLT INIT)

// ⚠️ BIZTONSÁGI FIGYELMEZTETÉS:
// A Firebase API kulcsok publikusak a frontendben - ez normális!
// VÉDELEM: Firebase Console → Project Settings → General → Web API Key
//          → Korlátozd a következő domain-ekre:
//          - szakichat-ai.web.app
//          - szakichat-ai.firebaseapp.com
//          - localhost (fejlesztéshez)
// Firestore Security Rules biztosítja az adatvédelmet!

import { initializeApp } from
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  setPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// 🔐 VALÓDI KONFIG (EGYETLEN HELYEN)
const firebaseConfig = {
  apiKey: "AIzaSyANKVxrmhFRm3BHDTtFzm6VwLTLLnwC8bs",
  authDomain: "szakichat-ai.firebaseapp.com",
  projectId: "szakichat-ai",
  storageBucket: "szakichat-ai.firebasestorage.app",
  messagingSenderId: "788780123554",
  appId: "1:788780123554:web:02357d45832906d46d1efb",
  measurementId: "G-0CR9LTBHQ5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Bejelentkezve maradás beállítása
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error('❌ Persistence hiba:', error);
});

export {
  auth,
  db,
  storage,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  setPersistence,
  browserLocalPersistence,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  ref,
  uploadBytes,
  getDownloadURL
};
