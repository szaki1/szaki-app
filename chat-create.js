// =========================================================
//  SzakiChat – chat-create.js (Firebase Auth verzió)
//  Chat létrehozása megrendelő és szaki között
// =========================================================

import { db, auth } from "./firebase-config.js";
import {
    doc,
    getDoc,
    updateDoc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
    initChatIfNeeded
} from "./messages.js";

// =========================================================
// CHAT INDÍTÁSA (megrendelő -> szaki)
// =========================================================
export async function startChatWithSzaki(szakiUid) {

    // --- 1. Bejelentkezett felhasználó lekérése Firebase Authból ---
    const user = auth.currentUser;

    if (!user) {
        alert("Hiba: nem vagy bejelentkezve!");
        window.location.href = "szaki-login.html";
        return;
    }

    const myUid = user.uid;

    // --- 2. Chat létrehozása, ha nem létezik ---
    const chatId = await initChatIfNeeded(myUid, szakiUid);

    // --- 3. Partner nevének lekérése (szaki neve) ---
    const partnerSnap = await getDoc(doc(db, "users", szakiUid));
    let partnerName = "Partner";

    if (partnerSnap.exists()) {
        partnerName = partnerSnap.data().name || "Partner";
    }

    // --- 4. Első üzenet / chatSession frissítése ---
    // updateDoc feltételezi, hogy a dokumentum létezik; ha valamiért nem, fallback setDoc-ot használunk merge-vel
    try {
        await updateDoc(doc(db, "chatSessions", chatId), {
            lastMessage: "Chat elindult",
            lastSender: myUid,
            lastTime: serverTimestamp()
        });
    } catch (e) {
        // ha updateDoc hibázik (pl. doc nem létezik), akkor létrehozzuk/merge-eljük
        if (e.code === 'not-found') {
            await setDoc(doc(db, "chatSessions", chatId), {
                lastMessage: "Chat elindult",
                lastSender: myUid,
                lastTime: serverTimestamp()
            }, { merge: true });
        } else {
            throw e;
        }
    }

    // --- 5. Átirányítás a chat oldalra ---
    window.location.href = `chat.html?chatId=${chatId}&partner=${encodeURIComponent(partnerName)}`;
}
