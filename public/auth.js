// AUTH.JS – Firebase Authentication kezelése

import {
    auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "./firebase-config.js";


// --- REGISZTRÁCIÓ ---
export function registerUser() {
    const name = document.getElementById("name")?.value;
    const email = document.getElementById("email")?.value;
    const password = document.getElementById("password")?.value;

    if (!name || !email || !password) {
        alert("Minden mezőt ki kell tölteni!");
        return;
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
            alert("Sikeres regisztráció!");
            window.location.href = "dashboard.html";
        })
        .catch((err) => {
            alert("Hiba: " + err.message);
        });
}



// --- BEJELENTKEZÉS ---
export function loginUser() {
    const email = document.getElementById("loginEmail")?.value;
    const password = document.getElementById("loginPassword")?.value;

    if (!email || !password) {
        alert("Minden mezőt ki kell tölteni!");
        return;
    }

    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            window.location.href = "dashboard.html";
        })
        .catch((err) => {
            alert("Hiba: " + err.message);
        });
}



// --- KIJELENTKEZÉS ---
export function logoutUser() {
    signOut(auth).then(() => {
        window.location.href = "login.html";
    });
}



// --- AUTOMATIKUS USER FIGYELÉS ---
onAuthStateChanged(auth, (user) => {
    window.currentUser = user;
});
