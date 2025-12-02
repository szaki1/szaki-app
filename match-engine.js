// =======================================================
// MATCH ENGINE – Szaki kiválasztó logika (Végleges verzió)
// =======================================================

import { db } from "./firebase-config.js";
import {
    collection,
    query,
    where,
    getDocs,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


// -------------------------------------------------------
// 1) Szakma alapján összes szaki lekérése
// -------------------------------------------------------
export async function getWorkersByProfession(profession) {
    const q = query(
        collection(db, "users"),
        where("role", "==", "szaki"),
        where("szakma", "==", profession.toLowerCase())
    );

    const snap = await getDocs(q);

    const results = [];
    snap.forEach(docu => {
        results.push({
            id: docu.id,
            ...docu.data()
        });
    });

    return results;
}


// -------------------------------------------------------
// 2) Első kör: online szakik prioritása
// -------------------------------------------------------
export function filterOnlineFirst(workers) {
    const online = workers.filter(w => w.online);
    const offline = workers.filter(w => !w.online);

    return [...online, ...offline];
}


// -------------------------------------------------------
// 3) Második kör: naptár (később bővítjük)
// Most placeholder: egyszerűen visszaad 3 szakembert
// -------------------------------------------------------
export function pickBest3(workers) {
    if (workers.length <= 3) return workers;
    return workers.slice(0, 3);
}


// -------------------------------------------------------
// 4) Match engine fő logika
// -------------------------------------------------------
export async function matchWorkers(profession) {

    // szakemberek szűrése
    const allWorkers = await getWorkersByProfession(profession);

    if (allWorkers.length === 0) return [];

    // online → majd offline
    const sorted = filterOnlineFirst(allWorkers);

    // top 3 kiválasztása
    const best = pickBest3(sorted);

    return best;  // [{id, name, online, szakma, ...}, ...]
}
