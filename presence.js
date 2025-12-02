/* ============================================================
   presence.js – SzakiChat.hu
   Valós idejű online/offline figyelés Firebase-ben
============================================================ */

import { auth, db } from "./firebase-config.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
    doc,
    updateDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

/* ============================================================
   USER FIGYELÉSE
============================================================ */

onAuthStateChanged(auth, async (user) => {
    if (!user) return;

    const uid = user.uid;
    const userRef = doc(db, "users", uid);

    // --- Böngésző bezárás / oldal elhagyás ---
    window.addEventListener("beforeunload", async () => {
        await updateDoc(userRef, {
            online: false,
            lastSeen: serverTimestamp()
        });
    });

    // --- KILÉPÉS ESEMÉNY ---

    document.addEventListener("visibilitychange", async () => {
        if (document.visibilityState === "hidden") {
            await updateDoc(userRef, {
                online: false,
                lastSeen: serverTimestamp()
            });
        }
        if (document.visibilityState === "visible") {
            await updateDoc(userRef, {
                online: true,
                lastSeen: serverTimestamp()
            });
        }
    });

    // --- BELÉPÉS UTÁN AZONNAL ONLINE ---
    await updateDoc(userRef, {
        online: true,
        lastSeen: serverTimestamp()
    });

    console.log("✔ Presence.js: online státusz aktív");
});
