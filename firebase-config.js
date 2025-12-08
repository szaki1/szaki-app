// Firebase 12 importok (modul verzió, webhez ajánlott)
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// --- SAJÁT FIREBASE CONFIG (helyesen javítva) ---
export const firebaseConfig = {
  apiKey: "AIzaSyANKVxrmhFRm3BHDTtFzm6VwLTLLnwC8bs",
  authDomain: "szakichat-ai.firebaseapp.com",
  projectId: "szakichat-ai",
  storageBucket: "szakichat-ai.appspot.com",  // ← JAVÍTVA!
  messagingSenderId: "788780123554",
  appId: "1:788780123554:web:02357d45832906d46d1efb",
  measurementId: "G-0CR9LTBHQ5"
};

// Inicializálás
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
