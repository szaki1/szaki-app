// =======================================================
// MATCH ENGINE – Szaki kiválasztó logika (VÉGLEGES VERZIÓ)
// =======================================================

import { db } from "./firebase-config.js";
import {
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


// -------------------------------------------------------
// SAJÁT NORMALIZÁLÓ FUNKCIÓ (biztonságos kisbetűsítés)
// -------------------------------------------------------
function norm(str) {
    return String(str || "").trim().toLowerCase();
}


// -------------------------------------------------------
// 1) Szakma + város alapján szakik lekérése
// -------------------------------------------------------
export async function getWorkersByProfession(profession, city = "Budapest") {

    const professionLower = norm(profession);
    const cityLower = norm(city);

    console.log("🔎 SZAKIK KERESÉSE:", professionLower, cityLower);

    const q = query(
        collection(db, "users"),
        where("role", "==", "szaki"),
        where("szakmaLower", "==", professionLower),
        where("cityLower", "==", cityLower)
    );

    const snap = await getDocs(q);

    const results = [];
    snap.forEach(docu => {
        const data = docu.data();
        results.push({
            id: docu.id,
            ...data,
            chatCount: data.chatCount || 0,   // TERHELTSÉG
            online: data.online || false
        });
    });

    console.log("📌 Talált szakik száma:", results.length);
    return results;
}


// -------------------------------------------------------
// 2) Online szakik előre
// -------------------------------------------------------
export function filterOnlineFirst(workers) {
    const online = workers.filter(w => w.online);
    const offline = workers.filter(w => !w.online);
    console.log("🟢 Online:", online.length, "⚪ Offline:", offline.length);

    return [...online, ...offline];
}


// -------------------------------------------------------
// 3) Terheltség ellenőrzés – max 3 chat
// -------------------------------------------------------
export function filterAvailable(workers) {
    const result = workers.filter(w => w.chatCount < 3);
    console.log("📉 Terhelhető szakik:", result.length);
    return result;
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

    console.log("🔥 MATCH FUT:", profession, city);

    // szakik lekérése
    let allWorkers = await getWorkersByProfession(profession, city);
    if (allWorkers.length === 0) {
        console.log("❌ Nincs elérhető szaki.");
        return [];
    }

    // online első
    allWorkers = filterOnlineFirst(allWorkers);

    // terheltség szűrés (max 3 chat)
    allWorkers = filterAvailable(allWorkers);

    if (allWorkers.length === 0) {
        console.log("❌ Mindenki túlterhelt.");
        return [];
    }

    // top 3
    const best = pickBest3(allWorkers);

    console.log("🏆 Kiválasztott szakik:", best.map(w => w.name));
    return best;
}
