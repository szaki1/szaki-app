// ======================================================
// SzakiChat – szaki-chat-list.js (VÉGLEGES)
// ======================================================

import { db, auth } from "./firebase.js";

import {
    doc, getDoc,
    collection, query, where,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

let uid = null;
let szakiData = null;
let blocked = [];

// ======================================================
// BELÉPÉS ELLENŐRZÉS
// ======================================================
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    uid = user.uid;

    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);

    szakiData = snap.data();
    blocked = szakiData.blockedUsers || [];

    watchChats();
});

// ======================================================
// CHAT LISTÁK REALTIME
// ======================================================
function watchChats() {
    const q = query(
        collection(db, "chats"),
        where("szakiID", "==", uid)
    );

    onSnapshot(q, (snap) => {
        const activeDiv = document.getElementById("activeList");
        const newDiv = document.getElementById("newList");

        activeDiv.innerHTML = "";
        newDiv.innerHTML = "";

        snap.forEach(docu => {
            const c = docu.data();

            // Ha blokkolva van → nem listázzuk
            if (blocked.includes(c.userID)) return;

            const isActive = c.accepted === true;

            const item = `
                <div class="chatItem" onclick="openChat('${docu.id}', '${c.userID}')">
                    <div class="name">${c.userDisplay}</div>
                    <div class="info">${c.lastMessage || "— nincs üzenet —"}</div>
                </div>
            `;

            if (isActive) activeDiv.innerHTML += item;
            else newDiv.innerHTML += item;
        });

        if (activeDiv.innerHTML.trim() === "") activeDiv.innerHTML = "<i>Nincs aktív beszélgetés.</i>";
        if (newDiv.innerHTML.trim() === "") newDiv.innerHTML = "<i>Nincs új megkeresés.</i>";
    });
}

// ======================================================
// CHAT MEGNYITÁSA
// ======================================================
window.openChat = function(chatID, partnerID) {
    window.location.href = `szaki-chat.html?chat=${chatID}&partner=${partnerID}`;
};
