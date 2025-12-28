/* ============================================================
   presence.js – SzakiChat.hu
   Valós idejű online/offline figyelés Firebase-ben
   (VÉGLEGES TISZTA VERZIÓ)
============================================================ */

import { auth, db } from "./firebase-config.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


onAuthStateChanged(auth, async (user) => {
    if (!user) return;

    const uid = user.uid;
    const userRef = doc(db, "users", uid);

    /* ---------------------------------------------------------
       1) LÉTEZIK-E USER DOKUMENTUM? HA NEM → LÉTREHOZZUK
    --------------------------------------------------------- */
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
        await setDoc(userRef, {
            online: true,
            lastSeen: serverTimestamp()
        }, { merge: true });
    }

    /* ---------------------------------------------------------
       2) BELÉPÉS UTÁN: ONLINE
    --------------------------------------------------------- */
    await updateDoc(userRef, {
        online: true,
        lastSeen: serverTimestamp()
    });

    console.log("✔ presence.js: felhasználó ONLINE");


    /* ---------------------------------------------------------
       3) FUNKCIÓ: OFFLINE FRISSÍTÉS
    --------------------------------------------------------- */
    async function setOffline() {
        try {
            await updateDoc(userRef, {
                online: false,
                lastSeen: serverTimestamp()
            });
            console.log("⚪ OFFLINE frissítve");
        } catch (err) {
            console.warn("Hiba offline frissítéskor:", err);
        }
    }


    /* ---------------------------------------------------------
       4) OLDAL ELHAGYÁSA / BÖNGÉSZŐ BEZÁRÁSA
    --------------------------------------------------------- */
    window.addEventListener("beforeunload", () => {
        setOffline();
    });


    /* ---------------------------------------------------------
       5) LÁTHATÓSÁG VÁLTOZÁS (mobil + PC)
          - háttérbe rakás → offline
          - visszatérés → online
    --------------------------------------------------------- */
    document.addEventListener("visibilitychange", async () => {
        if (document.visibilityState === "hidden") {
            await setOffline();
        } else {
            await updateDoc(userRef, {
                online: true,
                lastSeen: serverTimestamp()
            });
            console.log("🟢 Visszatért → ONLINE");
        }
    });
});
