// =======================================================
// MATCH ENGINE – Szaki kiválasztó logika (VÉGLEGES VERZIÓ)
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
// 1) Szakma + város alapján szakik lekérése
// -------------------------------------------------------
export async function getWorkersByProfession(profession, city = "Budapest") {

    const q = query(
        collection(db, "users"),
        where("role", "==", "szaki"),
        where("szakma", "==", profession.toLowerCase()),
        where("city", "==", city.toLowerCase())
    );

    const snap = await getDocs(q);

    const results = [];
    snap.forEach(docu => {
        const data = docu.data();
        results.push({
            id: docu.id,
            ...data,
            chatCount: data.chatCount || 0   // TERHELTSÉG
        });
    });

    return results;
}


// -------------------------------------------------------
// 2) Online szakik előre
// -------------------------------------------------------
export function filterOnlineFirst(workers) {
    const online = workers.filter(w => w.online);
    const offline = workers.filter(w => !w.online);
    return [...online, ...offline];
}


// -------------------------------------------------------
// 3) Terheltség ellenőrzés – max 3 chat
// -------------------------------------------------------
export function filterAvailable(workers) {
    return workers.filter(w => w.chatCount < 3);
}


// -------------------------------------------------------
// 4) Legjobb 3 szaki kiválasztása
// -------------------------------------------------------
export function pickBest3(workers) {
    if (workers.length <= 3) return workers;
    return workers.slice(0, 3);
}


// -------------------------------------------------------
// 5) Match engine fő logika
// -------------------------------------------------------
export async function matchWorkers(profession, city = "Budapest") {

    // szakik lekérése
    let allWorkers = await getWorkersByProfession(profession, city);
    if (allWorkers.length === 0) return [];

    // online első
    allWorkers = filterOnlineFirst(allWorkers);

    // terheltség szűrés (max 3 chat)
    allWorkers = filterAvailable(allWorkers);

    if (allWorkers.length === 0) return [];

    // top 3
    const best = pickBest3(allWorkers);

    return best;
}
