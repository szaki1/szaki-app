// =========================================================
//  SzakiChat – chat-create.js (Firebase Auth verzió)
//  Chat létrehozása megrendelő és szaki között – JAVÍTVA!!
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

    // 1. Bejelentkezett user kell
    const user = auth.currentUser;
    if (!user) {
        alert("Hiba: nem vagy bejelentkezve!");
        window.location.href = "login.html";
        return;
    }

    const myUid = user.uid;

    // 2. Chat létrehozása, ha még nincs
    const chatId = await initChatIfNeeded(myUid, szakiUid);

    // 3. Szaki neve később is lekérhető -> nem kell URL-ben küldeni
    // (chat.html a szakiUid alapján fogja megkeresni)

    // 4. Chat session frissítése
    await updateDoc(doc(db, "chatSessions", chatId), {
        lastMessage: "Chat elindult",
        lastSender: myUid,
        lastTime: serverTimestamp()
    });

    // 5. HELYES átirányítás – FONTOS!
    // chatID (nagy D), partner = UID !!
    window.location.href = `chat.html?chatID=${chatId}&partner=${szakiUid}`;
}
