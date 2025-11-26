// -------------------------------------------------------------
// Szaki-App – MUNKA MATCHING LOGIKA (orderId kezelése + választás)
// -------------------------------------------------------------
// Ezt a fájlt tedd a projekt gyökerébe: matching-job-flow.js
// Betöltés: <script src="matching-job-flow.js"></script>
// -------------------------------------------------------------

(function () {

    // --- Firestore import (chat.html vagy más modul tölti be) ---
    let db = null;
    window.MatchFlow_initFirestore = function (firestoreInstance) {
        db = firestoreInstance;
    };

    // -------------------------------------------------------------
    // 1) ÚJ MUNKA létrehozása
    // -------------------------------------------------------------
    window.MatchFlow_createJob = async function (megrendelonev, szakma) {

        if (!db) {
            console.error("Firestore nincs inicializálva.");
            return null;
        }

        const orderId = generateOrderId();

        try {
            const ref = doc(db, "jobs", orderId);
            await setDoc(ref, {
                orderId,
                createdAt: Date.now(),
                megrendelonev: megrendelonev || "",
                szakma: szakma || "",
                selectedWorkerId: null,
                selectedWorkerName: null,
                status: "pending",
                rejectedWorkers: []
            });

            return orderId;

        } catch (err) {
            console.error("Job létrehozási hiba:", err);
            return null;
        }
    };


    // -------------------------------------------------------------
    // 2) SZAKI kiválasztása (nyertes szaki)
    // -------------------------------------------------------------
    window.MatchFlow_chooseWorker = async function (orderId, workerName) {

        if (!db) return console.error("Firestore nincs inicializálva.");

        const ref = doc(db, "jobs", orderId);

        try {
            await updateDoc(ref, {
                selectedWorkerName: workerName,
                status: "chosen"
            });

            // NYERT SZAKINAK automatikus üzenet küldése
            await sendAutoSystemMessage(workerName,
                "Gratulálunk! A megrendelő Téged választott! 🎉");

            console.log(`Nyertes szaki: ${workerName}`);

        } catch (err) {
            console.error("Szaki kiválasztása sikertelen:", err);
        }
    };


    // -------------------------------------------------------------
    // 3) VESZTETT szakik kezelése
    // -------------------------------------------------------------
    window.MatchFlow_rejectWorker = async function (orderId, workerName) {

        if (!db) return console.error("Firestore nincs inicializálva.");

        const ref = doc(db, "jobs", orderId);

        try {
            await updateDoc(ref, {
                rejectedWorkers: arrayUnion(workerName),
                status: "rejected"
            });

            // VESZTETT SZAKINAK automatikus üzenet
            await sendAutoSystemMessage(workerName,
                "Sajnos a megrendelő másik szakembert választott.");

            console.log(`Elutasított szaki: ${workerName}`);

        } catch (err) {
            console.error("RejectWorker hiba:", err);
        }
    };


    // -------------------------------------------------------------
    // 4) AUTOMATA RENDSZERÜZENET KÜLDÉS Firestore-ba
    // -------------------------------------------------------------
    async function sendAutoSystemMessage(workerName, text) {
        try {
            const roomId = canonicalRoom(workerName, "megrendelő");
            const chatRef = collection(db, "chats", roomId, "uzenetek");

            await addDoc(chatRef, {
                senderName: "Rendszer",
                text,
                timestamp: serverTimestamp(),
                system: true
            });

        } catch (err) {
            console.error("Rendszerüzenet hiba:", err);
        }
    }


    // -------------------------------------------------------------
    // 5) MUNKA BETÖLTÉSE (munka-részletei.html használja)
    // -------------------------------------------------------------
    window.MatchFlow_loadJob = async function (orderId) {
        if (!db) return null;
        try {
            const ref = doc(db, "jobs", orderId);
            const snap = await getDoc(ref);
            return snap.exists() ? snap.data() : null;
        } catch (err) {
            console.error("Job betöltés hiba:", err);
            return null;
        }
    };


    // -------------------------------------------------------------
    // SEGÉDEK
    // -------------------------------------------------------------
    function generateOrderId() {
        return "job_" + Math.random().toString(36).substring(2, 10);
    }

    function canonicalRoom(a, b) {
        const x = (a || "").trim().toLowerCase();
        const y = (b || "").trim().toLowerCase();
        return [x, y].sort().join("__");
    }

})();
