// =========================================================
//  SzakiChat – chat-create.js (Firebase Auth verzió)
//  Chat létrehozása megrendelő és szaki között
// =========================================================

import { db, auth } from "./firebase-config.js";
import {
    doc,
    getDoc,
    updateDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
    generateChatId,
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

    // --- 4. Első üzenet chatSession-be ---
    await updateDoc(doc(db, "chatSessions", chatId), {
        lastMessage: "Chat elindult",
        lastSender: myUid,
        lastTime: serverTimestamp()
    });

    // --- 5. Átirányítás a chat oldalra ---
    window.location.href = `chat.html?chatId=${chatId}&partner=${encodeURIComponent(partnerName)}`;
}
