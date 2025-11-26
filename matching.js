// --------------------------------------------------------------
// Szaki-App – Automatikus Matching Motor
// --------------------------------------------------------------
// Ez a fájl felelős azért, hogy egy megrendelő munkájához
// automatikusan megtalálja a legjobb szakikat és értesítést
// küldjön nekik Firestore-ban.
//
// Integráció: minden oldal importálhatja:
// import { assignWorkToSzakik } from "./matching.js";
// --------------------------------------------------------------

import { app, db } from "./firebase-config.js";
import {
    collection,
    doc,
    addDoc,
    getDocs,
    query,
    where,
    orderBy,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// --------------------------------------------------------------
// 1) A SZAKIK LEKÉRÉSE (users_status + szakik gyűjtemény)
// --------------------------------------------------------------

async function loadAllWorkersByProfession(profession) {

    const ref = collection(db, "szakik");
    const q = query(ref, where("profession", "array-contains", profession));
    const snap = await getDocs(q);

    const list = [];

    snap.forEach(docSnap => {
        const d = docSnap.data();
        list.push({
            name: d.name,
            profession: d.profession,
            priority: d.priority || 0,
            isOnline: d.isOnline || false,
            lastActive: d.lastActive || null
        });
    });

    return list;
}

// --------------------------------------------------------------
// 2) TOP 3 SZAKEMBER KIVÁLASZTÁSA
// --------------------------------------------------------------

function pickBestWorkers(all) {

    if (!all.length) return [];

    // 1. Online szakik előre
    const online = all.filter(s => s.isOnline);
    const offline = all.filter(s => !s.isOnline);

    // 2. Online-okon belül rendezés priority szerint
    online.sort((a, b) => (b.priority || 0) - (a.priority || 0));

    // 3. Offline-okon belül ugyanez
    offline.sort((a, b) => (b.priority || 0) - (a.priority || 0));

    const finalList = [...online, ...offline];

    return finalList.slice(0, 3); // MAX 3 szakember
}

// --------------------------------------------------------------
// 3) FIRESTORE ÉRTESÍTÉS LÉTREHOZÁSA
// --------------------------------------------------------------

async function notifyWorker(workerName, orderId, orderData) {

    const ref = collection(db, "ertesitesek");

    await addDoc(ref, {
        worker: workerName,
        orderId: orderId,
        order: orderData,
        timestamp: serverTimestamp(),
        read: false,
        message: "Új munka érkezett hozzád!"
    });
}

// --------------------------------------------------------------
// 4) A KÖZPONTI MATCHING FUNKCIÓ
// --------------------------------------------------------------

export async function assignWorkToSzakik(orderId, orderData) {

    const profession = orderData.profession;

    // 1) Lekérjük a szakikat
    const allWorkers = await loadAllWorkersByProfession(profession);
    if (!allWorkers.length) {
        console.warn("Nincs szakember ehhez a szakmához:", profession);
        return [];
    }

    // 2) Kiválasztjuk a TOP 3-at
    const selected = pickBestWorkers(allWorkers);

    // 3) Firestore értesítések küldése
    for (const w of selected) {
        await notifyWorker(w.name, orderId, orderData);
    }

    return selected; // visszaadjuk, hogy a megrendelő lássa, kik lettek értesítve
}

// --------------------------------------------------------------
// 5) Debug
// --------------------------------------------------------------
window.assignWorkToSzakik = assignWorkToSzakik;
