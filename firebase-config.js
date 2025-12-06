// Firebase 10.12 CDN verziók
import { initializeApp } 
    from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import { getAuth } 
    from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import { getFirestore } 
    from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


// 🔥 SAJÁT KONFIG – HELYES DOMAINNEL!
const firebaseConfig = {
    apiKey: "AIzaSyAKhHvi3yObUurBKhT1r_feg4g0A5w766Q",
    authDomain: "szaki-app.firebaseapp.com",
    projectId: "szaki-app",
    storageBucket: "szaki-app.appspot.com",     // ← JAVÍTVA!
    messagingSenderId: "418149364598",
    appId: "1:418149364598:web:2ae4450dc8fadfbac30057"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export – kell a login, admin, chat mindenhez
export const auth = getAuth(app);
export const db = getFirestore(app);
