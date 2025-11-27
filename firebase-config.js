// --- Firebase CDN, teljesen GitHub Pages kompatibilis --- //

import { initializeApp }
    from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import { getFirestore }
    from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import { getAuth }
    from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// --- Szaki-App config --- //
const firebaseConfig = {
    apiKey: "AIzaSyAKhHvi3yObUurBKhT1r_feg4g0A5w766Q",
    authDomain: "szaki-app.firebaseapp.com",
    projectId: "szaki-app",
    storageBucket: "szaki-app.appspot.com", // ✔ EZ A HELYES!!!
    messagingSenderId: "418149364598",
    appId: "1:418149364598:web:2ae4450dc8fadfbac30057"
};

// --- Inicializálás --- //
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
