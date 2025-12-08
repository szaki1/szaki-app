// Firebase importok
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// Új Firebase konfiguráció
export const firebaseConfig = {
  apiKey: "AIzaSyDQTcc2PS32EaGLdS5Wv2er_oAMW_w50fU",
  authDomain: "szakichat-v2.firebaseapp.com",
  projectId: "szakichat-v2",
  storageBucket: "szakichat-v2.firebasestorage.app",
  messagingSenderId: "675957041716",
  appId: "1:675957041716:web:d371840aabfb45b8f2f861"
};

// Inicializálás
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
