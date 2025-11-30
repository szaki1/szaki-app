// ===================================================================
// Szaki-App – Online státusz motor (ál-szakik automatikus kezelése)
// Másold be a projekt gyökerébe változtatás nélkül.
// ===================================================================

(function(){

    // -------------- AI automatikus válaszok az álszakiktól --------------
    const AUTO_REPLIES = [
        "Szia! Ne haragudj, most nem tudok új munkát vállalni.",
        "Szia! Most teljesen be vagyok táblázva.",
        "Szia! Köszönöm az üzenetet, de jelenleg nincs kapacitásom.",
        "Szia! Most nem tudok segíteni, próbálj másik szakembert.",
        "Szia! Most sajnos nem tudok munkát vállalni.",
        "Szia! Jelenleg nem vagyok elérhető, bocsi!"
    ];

    // -------------- Ha egy ál-szakinak írnak → automata chat válasz --------------
    window.fakeWorkerAutoReply = function(partner){
        const msg = AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)];

        return {
            senderName: partner,
            text: msg,
            timestamp: new Date()
        };
    };

    // -------------- Online motor beállítások --------------
    const REFRESH_INTERVAL = 60000; // 1 perc
    const ONLINE_PER_PROFESSION = 2;

    function randomInt(max){
        return Math.floor(Math.random() * max);
    }

    // -------------- Fő frissítő --------------
    window.SzakiOnlineEngine = {

        updateOnlineStatus(){
            const list = window.SzakiAdatok.getAllSzakik();

            // szakmánként csoportosítás
            const grouped = {};

            list.forEach(sz => {
                const profs = Array.isArray(sz.profession) ? sz.profession : [sz.profession];
                profs.forEach(p => {
                    if (!grouped[p]) grouped[p] = [];
                    grouped[p].push(sz);
                });
            });

            // szakmánként 2 online – többi offline
            Object.keys(grouped).forEach(prof => {
                const arr = grouped[prof];

                // random keverés
                arr.sort(() => Math.random() - 0.5);

                arr.forEach((sz, i) => {
                    if (i < ONLINE_PER_PROFESSION) {
                        sz.isOnline = true;
                        sz.lastSeenMinutes = 0;
                    } else {
                        sz.isOnline = false;
                        sz.lastSeenMinutes = randomInt(19) + 1; // 1–20 perc között
                    }
                });
            });

            window.SzakiAdatok.applyDynamicStatuses(list);
        }
    };

    // -------------- Alkalmazzuk a módosított státuszokat --------------
    window.SzakiAdatok.applyDynamicStatuses = function(updatedList){
        const base = window.SzakiAdatok.getAllSzakik();

        updatedList.forEach(newSz => {
            const orig = base.find(o => o.name === newSz.name);
            if (orig){
                orig.isOnline = newSz.isOnline;
                orig.lastSeenMinutes = newSz.lastSeenMinutes;
            }
        });

        // frissített lista eltárolása
        window.SzakiAdatok._dynamicOverride = base;
    };

    // felülírja getAllSzakik-t
    const originalGetAll = window.SzakiAdatok.getAllSzakik;
    window.SzakiAdatok.getAllSzakik = function(){
        return window.SzakiAdatok._dynamicOverride || originalGetAll();
    };

    // indítás
    window.SzakiOnlineEngine.updateOnlineStatus();
    setInterval(window.SzakiOnlineEngine.updateOnlineStatus, REFRESH_INTERVAL);

})();
