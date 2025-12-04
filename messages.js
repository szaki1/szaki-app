// =========================================================
//  SzakiChat – messages.js
//  Valós idejű üzenetkezelő és chat motor
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
// CHAT ID GENERÁLÁS (ABC sorrend, mindenkihez ugyanaz)
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
        const partnerRef = doc(db, "users", partnerUid);
        const partnerSnap = await getDoc(partnerRef);
        const partner = partnerSnap.exists() ? partnerSnap.data() : { name: "Ismeretlen" };

        // saját adatok
        const meRef = doc(db, "users", uid);
        const meSnap = await getDoc(meRef);
        const me = meSnap.exists() ? meSnap.data() : { name: "Felhasználó" };

        // chat létrehozása
        await setDoc(chatRef, {
            chatId,
            users: [uid, partnerUid],
            lastMessage: "",
            lastSender: "",
            lastTime: serverTimestamp()
        });

        // saját chatlista bővítése
        await setDoc(
            doc(db, "users", uid),
            {
                chatList: {
                    [chatId]: {
                        uid: partnerUid,
                        name: partner.name || "Ismeretlen",
                        lastMessage: "",
                        unread: 0
                    }
                }
            },
            { merge: true }
        );

        // partner chatlista bővítése
        await setDoc(
            doc(db, "users", partnerUid),
            {
                chatList: {
                    [chatId]: {
                        uid,
                        name: me.name || "Felhasználó",
                        lastMessage: "",
                        unread: 0
                    }
                }
            },
            { merge: true }
        );
    }

    return chatId;
}


// =========================================================
// ÜZENET KÜLDÉSE
// =========================================================
export async function sendMessage(chatId, senderUid, text) {
    if (!text.trim()) return;

    // üzenet mentése
    await addDoc(collection(db, "messages", chatId, "items"), {
        sender: senderUid,
        text,
        time: serverTimestamp()
    });

    // chat session frissítése
    await updateDoc(doc(db, "chatSessions", chatId), {
        lastMessage: text,
        lastSender: senderUid,
        lastTime: serverTimestamp()
    });
}


// =========================================================
// VALÓS IDEJŰ ÜZENET FIGYELÉS
// =========================================================
export function subscribeToMessages(chatId, callback) {
    const q = query(
        collection(db, "messages", chatId, "items"),
        orderBy("time", "asc")
    );

    return onSnapshot(q, (snapshot) => {
        const messages = [];
        snapshot.forEach((doc) => {
            messages.push({ id: doc.id, ...doc.data() });
        });
        callback(messages);
    });
}


// =========================================================
// PARTNER ADATOK
// =========================================================
export async function getPartnerData(uid) {
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);
    return snap.data();
}
