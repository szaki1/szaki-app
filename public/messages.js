// =========================================================
//  SzakiChat – messages.js (Végleges, Hibamentes Verzió)
// =========================================================

import { db } from "./firebase-config.js";
import {
    doc,
    setDoc,
    getDoc,
    updateDoc,
    onSnapshot,
    collection,
    addDoc,
    serverTimestamp,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


// =========================================================
// CHAT ID GENERÁLÁS (ABC sorrend)
// =========================================================
export function generateChatId(uid1, uid2) {
    return uid1 < uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;
}


// =========================================================
// CHAT LÉTREHOZÁSA – ha még nincs
// =========================================================
export async function initChatIfNeeded(uid, partnerUid) {
    const chatId = generateChatId(uid, partnerUid);
    const chatRef = doc(db, "chatSessions", chatId);

    const snap = await getDoc(chatRef);
    if (!snap.exists()) {

        // partner adatok
        const partnerSnap = await getDoc(doc(db, "users", partnerUid));
        const partner = partnerSnap.exists() ? partnerSnap.data() : { name: "Ismeretlen" };

        // saját adatok
        const meSnap = await getDoc(doc(db, "users", uid));
        const me = meSnap.exists() ? meSnap.data() : { name: "Felhasználó" };

        // chatSession létrehozása
        await setDoc(chatRef, {
            chatId,
            users: [uid, partnerUid],
            lastMessage: "",
            lastSender: "",
            lastTime: serverTimestamp()
        });

        // SAJÁT chat lista
        await updateDoc(doc(db, "users", uid), {
            [`chatList.${chatId}`]: {
                uid: partnerUid,
                name: partner.name || "Ismeretlen",
                lastMessage: "",
                unread: 0
            }
        });

        // PARTNER chat lista
        await updateDoc(doc(db, "users", partnerUid), {
            [`chatList.${chatId}`]: {
                uid,
                name: me.name || "Felhasználó",
                lastMessage: "",
                unread: 0
            }
        });
    }

    return chatId;
}


// =========================================================
// ÜZENET KÜLDÉSE
// =========================================================
export async function sendMessage(chatId, senderUid, text) {
    if (!text.trim()) return;

    // új üzenet tárolása
    await addDoc(collection(db, "messages", chatId, "items"), {
        sender: senderUid,
        text,
        time: serverTimestamp()
    });

    // chat meta frissítése
    await updateDoc(doc(db, "chatSessions", chatId), {
        lastMessage: text,
        lastSender: senderUid,
        lastTime: serverTimestamp()
    });
}


// =========================================================
// VALÓS IDEJŰ ÜZENET FIGYELÉS
// =========================================================
export function subscribeToMessages(chatId, callba
