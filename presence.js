/* ============================================================
   presence.js – SzakiChat.hu
   Valós idejű online/offline figyelés Firebase-ben (VÉGLEGES)
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

/* ============================================================
   USER FIGYELÉSE
============================================================ */

onAuthStateChanged(auth, async (user) => {
    if (!user) return;

    const uid = user.uid;
    const userRef = doc(db, "users", uid);

    // --- Ha a user dokumentuma nem létezik → létrehozzuk ---
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
        await setDoc(userRef, {
            online: true,
            lastSeen: serverTimestamp()
        }, { merge: true });
    }

    // --- BELÉPÉS UTÁN: ONLINE ---
    await updateDoc(userRef, {
        online: true,
        lastSeen: serverTimestamp()
    });

    console.log("✔ presence.js: felhasználó ONLINE");

    /* ============================================================
       OLDAL ELHAGYÁSA → OFFLINE
       (böngésző bezárás, fülváltás, app kilépés)
    ============================================================ */

    async function goOffline() {
        try {
            await updateDoc(userRef, {
                online: false,
                lastSeen: serverTimestamp()
            });
        } catch (e) {
            console.warn("Presence offline update failed:", e);
        }
    }

    // Fül bezárás, oldal elhagyás
    window.addEventListener("beforeunload", goOffline);

    // Mobil háttérbe rakás / visszatérés
    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") {
            goOffline();
        } else {
            updateDoc(userRef, {
                online: true,
                lastSeen: serverTimestamp()
            });
        }
    });
});
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
