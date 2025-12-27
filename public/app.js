// App.js – központi logika

import {
    auth,
    onAuthStateChanged,
    db,
    collection,
    addDoc,
    serverTimestamp
} from "./firebase-config.js";


// Ellenőrzi, hogy a user be van-e jelentkezve
onAuthStateChanged(auth, (user) => {
    window.currentUser = user;
});


// Általános logoló függvény (később AI is használja)
export async function logEvent(type, data = {}) {
    try {
        await addDoc(collection(db, "adminLogs"), {
            type,
            data,
            user: currentUser ? currentUser.uid : "guest",
            time: serverTimestamp()
        });
    } catch (err) {
        console.error("Log hiba:", err);
    }
}
