// ======================================================
// MATCHING – SZAKI KIVÁLASZTÁS ÚJ MUNKA ÉRKEZÉSEKOR
// ======================================================

import { db, auth } from "./firebase-config.js";
import {
    collection,
    getDocs,
    getDoc,
    updateDoc,
    doc,
    query,
    where,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

/*
    Folyamat:
    1) Lekérjük a megrendelést a megrendelesek-ből
    2) Kivesszük belőle a szakmákat
    3) Kikeressük a szaki-adatok gyűjteményből azokat, akik ezt a szakmát vállalják
    4) Megnézzük, kik vannak online (szaki-online gyűjtemény)
    5) Ha van online → 1 szakival AZONNAL összekapcsoljuk
    6) Ha nincs online → kiválasztunk 3 szakít a naptár alapján
    7) Frissítjük a megrendelést → assignedTo = [szakiUidak]
    8) A szakiknak értesítés Firestore-ba
*/

// ------------------------------------------------------
// FŐ FÜGGVÉNY – EZT HÍVJA MEG A RENDSZER
// ------------------------------------------------------
export async function matchJobToWorkers(jobId) {
    try {
        const jobRef = doc(db, "megrendelesek", jobId);
        const jobSnap = await getDoc(jobRef);

        if (!jobSnap.exists()) {
            console.error("❌ A megrendelés nem található:", jobId);
            return;
        }

        const jobData = jobSnap.data();
        const neededSkills = jobData.szakmak;

        console.log("👉 Új megrendelés érkezett:", jobData);

        // ---------------------------------------------
        // 1) Lekérjük az összes SZAKIT
        // ---------------------------------------------
        const workersRef = collection(db, "szaki-adatok");
        const workersSnap = await getDocs(workersRef);

        let matchingWorkers = [];

        workersSnap.forEach(worker => {
            const data = worker.data();

            // Ellenőrzés: van-e közös szakma
            const hasSkill = data.szakmak?.some(s => neededSkills.includes(s));

            if (hasSkill) {
                matchingWorkers.push({
                    uid: worker.id,
                    ...data
                });
            }
        });

        if (matchingWorkers.length === 0) {
            console.log("❌ Nincs egyetlen szaki sem, aki illik a keresett szakmákra.");
            return;
        }

        console.log("🎯 Illeszkedő szakik:", matchingWorkers.length);

        // ---------------------------------------------
        // 2) MEGNÉZZÜK, KI VAN ONLINE
        // ---------------------------------------------
        const onlineRef = collection(db, "szaki-online");
        const onlineSnap = await getDocs(onlineRef);

        const onlineWorkers = [];

        onlineSnap.forEach(o => {
            const odata = o.data();
            const isMatching = matchingWorkers.some(w => w.uid === odata.uid);

            if (isMatching && odata.online === true) {
                onlineWorkers.push(odata.uid);
            }
        });

        // ---------------------------------------------
        // 3) Ha VAN ONLINE SZAKI → AZONNAL HOZZÁRENDELJÜK
        // ---------------------------------------------
        if (onlineWorkers.length > 0) {
            const firstOnline = onlineWorkers[0];

            await updateDoc(jobRef, {
                assignedTo: [firstOnline],
                status: "kiosztva",
                matchedAt: serverTimestamp()
            });

            console.log("⚡ Online szaki megtalálva → azonnali hozzárendelés:", firstOnline);

            // értesítés neki
            await addDoc(collection(db, "szaki-ertesitesek"), {
                uid: firstOnline,
                jobId,
                type: "uj-munka",
                createdAt: serverTimestamp()
            });

            return; // DONE
        }

        // ---------------------------------------------
        // 4) Ha NINCS ONLINE → NAPTÁR ALAPJÁN TOP 3
        // ---------------------------------------------
        console.log("ℹ️ Nincs online szaki → keresés naptár alapján…");

        // egyszerű sorrend (később okosítjuk):
        const top3 = matchingWorkers.slice(0, 3).map(w => w.uid);

        await updateDoc(jobRef, {
            assignedTo: top3,
            status: "kiosztva",
            matchedAt: serverTimestamp()
        });

        console.log("📌 Naptár alapján kiosztott szakik:", top3);

        // értesítések
        for (let uid of top3) {
            await addDoc(collection(db, "szaki-ertesitesek"), {
                uid,
                jobId,
                type: "uj-munka",
                createdAt: serverTimestamp()
            });
        }

    } catch (err) {
        console.error("❌ Matching hiba:", err);
    }
}
