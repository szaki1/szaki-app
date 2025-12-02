/* ============================================================
   FIREBASE – ALAPKONFIG (SzakiChat.hu)
   Ez a rendszer motorja: Auth + Firestore + Realtime állapotok
============================================================ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
    getAuth,
    onAuthStateChanged,
    browserLocalPersistence,
    setPersistence
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


/* ============================================================
   IDE ÍRD BE A SAJÁT FIREBASE PROJEKTED ADATAIT
   (Firebase Console → Project Settings → SDK setup)
============================================================ */

const firebaseConfig = {
    apiKey: "IDE",
    authDomain: "IDE",
    projectId: "IDE",
    storageBucket: "IDE",
    messagingSenderId: "IDE",
    appId: "IDE"
};

/* ============================================================
   AZ APP ELINDÍTÁSA
============================================================ */

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);


/* ============================================================
   TARTÓS BEJELENTKEZÉS
============================================================ */
setPersistence(auth, browserLocalPersistence);


/* ============================================================
   HELYI FUNKCIÓ: AUTO-LOGIN FIGYELÉS
============================================================ */
export function watchAuthChanges(callback) {
    onAuthStateChanged(auth, (user) => {
        callback(user);
    });
}
