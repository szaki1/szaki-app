// ======================================================================
//  SzakiChat – match-engine.js
//  Automatikus szaki párosítás megrendelőnek
// ======================================================================

import { db } from "./firebase-config.js";

import {
    collection,
    query,
    where,
    getDocs,
    orderBy,
    limit
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import { startChatWithSzaki } from "./chat-create.js";


// ======================================================================
//  SZAKI LISTA LEKÉRÉSE FIRESTORE-BÓL
// ======================================================================
export async function findSzakikBySzakma(szakma) {
    const q = query(
        collection(db, "users"),
        where("role", "==", "szaki"),
        where("szakma", "==", szakma)
    );

    const snap = await getDocs(q);
    const szakik = [];

    snap.forEach((d) => szakik.push({ uid: d.id, ...d.data() }));

    return szakik;
}


// ======================================================================
//  PÁROSÍTÓ ALGORITMUS:
//  1) Online szakik előre
//  2) Ha nincs online → legutóbbi aktivitás szerint 3 szakival próbálkozik
// ======================================================================
export async function matchBestSzaki(szakma) {
    const szakik = await findSzakikBySzakma(szakma);

    if (szakik.length === 0) return null;

    // 1) ONLINE szakik kiemelése
    const online = szakik.filter((s) => s.online === true);

    if (online.length > 0) {
        // A legfrissebb online legyen az első
        online.sort((a, b) => (b.lastSeen?.seconds || 0) - (a.lastSeen?.seconds || 0));
        return online[0];
    }

    // 2) Nincs online → válasszunk 3 legaktívabbat
    szakik.sort((a, b) => (b.lastSeen?.seconds || 0) - (a.lastSeen?.seconds || 0));

    return szakik.slice(0, 3);  // több jelöltet visszaad
}


// ======================================================================
//  CHAT INDÍTÁSA A LEGJOBB SZAKIVAL
// ======================================================================
export async function connectMegrendeloToSzaki(szakma) {
    const match = await matchBestSzaki(szakma);

    if (!match) {
        alert("Ehhez a szakmához jelenleg nincs elérhető szakember!");
        return;
    }

    // Ha egy szaki van → azonnal chat
    if (!Array.isArray(match)) {
        return startChatWithSzaki(match.uid);
    }

    // Ha több szaki van → küldjük a megrendelést mindháromnak
    for (const szaki of match) {
        startChatWithSzaki(szaki.uid);
    }
}
