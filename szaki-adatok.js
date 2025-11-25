// Szaki-App – egységes szaki adatbázis + segédfüggvények
// Másold be ezt a fájlt változtatás nélkül a projekt gyökerébe.
// Minden oldal (regisztráció, szaki választás, chat) innen fog olvasni.

(function () {

    // --- ALAP SZAKI LISTA (bővíthető) ---
    // Az app támogatja:
    // - több szakmát per fő (profession: string vagy array)
    // - online/offline státusz
    // - naptár elérhetőség
    // - limitált megrendelések száma
    // - holiday (szabadság)
    const SZAKIK = [
        {
            name: "Csabi",
            profession: ["Festő", "Burkoló", "Teljes felújítás"],
            note: "",
            phone: "+36 20 123 4567",
            isReal: true,
            isOnline: true,           // <- mindig elérhető
            priority: 100,            // <- korlátlan megrendelői chat
            maxJobs: Infinity,        // <- végtelen
            calendarAvailability: "always"
        },
        {
            name: "Zsolti",
            profession: ["Villanyszerelő", "Gépész"],
            note: "Gyors javítások, kisebb munkák azonnal",
            phone: "+36 30 765 4321",
            isReal: true,
            isOnline: true,
            priority: 90,             // <- te utánad ő a második
            maxJobs: Infinity,
            calendarAvailability: "always"
        },
        {
            name: "Demo Péter",
            profession: "Villanyszerelő",
            note: "Szabadság miatt nem elérhető",
            phone: "+36 70 111 2222",
            isReal: false,
            isOnline: false,
            priority: 10,
            maxJobs: 3,
            holidays: { 
                from: "2025-08-01", 
                to: "2025-08-20" 
            },
            calendarAvailability: "busy"
        },
        {
            name: "Anna",
            profession: ["Festő"],
            note: "Több lakást is felújítottam",
            phone: "+36 20 999 8888",
            isReal: true,
            isOnline: false,
            priority: 30,
            maxJobs: 3,
            calendarAvailability: "normal"
        }
    ];


    // --- EXPORT ---
    window.SzakiAdatok = {

        // Teljes lista (clonolva)
        getAllSzakik: function () {
            return SZAKIK.map(s => JSON.parse(JSON.stringify(s)));
        },

        // Egy szakma alapján szűrés
        findByProfession: function (szakma) {
            return SZAKIK.filter(szaki => {
                if (Array.isArray(szaki.profession)) {
                    return szaki.profession.includes(szakma);
                }
                return szaki.profession === szakma;
            }).map(s => JSON.parse(JSON.stringify(s)));
        },

        // Csak az online szakik (elsődleges találati prioritás)
        getOnlineSzakik: function (szakma) {
            return SZAKIK
                .filter(sz => {
                    if (!sz.isOnline) return false;
                    if (Array.isArray(sz.profession)) {
                        return sz.profession.includes(szakma);
                    }
                    return sz.profession === szakma;
                })
                .map(s => JSON.parse(JSON.stringify(s)));
        },

        // Naptár alapú fallback (ha nincs online szaki)
        getCalendarBasedBackup: function (szakma) {
            return SZAKIK
                .filter(sz => {
                    if (sz.isOnline) return false;
                    if (Array.isArray(sz.profession)) {
                        return sz.profession.includes(szakma);
                    }
                    return sz.profession === szakma;
                })
                .sort((a, b) => (b.priority || 0) - (a.priority || 0))
                .map(s => JSON.parse(JSON.stringify(s)));
        },

        getDisplayPhone: function (szaki) {
            if (!szaki || !szaki.phone) return "";
            return szaki.phone;
        },

        getHolidayLabel: function (szaki) {
            if (!szaki || !szaki.holidays) return "";
            const h = szaki.holidays;
            if (h.from && h.to) return `Nyaralás: ${h.from} – ${h.to}`;
            if (h.from) return `Nyaralás kezdete: ${h.from}`;
            if (h.to) return `Nyaralás vége: ${h.to}`;
            return "";
        }
    };

})();
