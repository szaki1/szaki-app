import { initializeApp } 
    from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import { getAuth } 
    from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import { getFirestore } 
    from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


// 🔥 IDE ÍRD A SAJÁT KONFIGODAT!
const firebaseConfig = {
    apiKey: "IDE",
    authDomain: "szaki-app.firebaseapp.com",
    projectId: "szaki-app",
    storageBucket: "szaki-app.appspot.com",
    messagingSenderId: "IDE",
    appId: "IDE"
};


// Init
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
