/* szaki-adatok.js – DEMÓ + VALÓDI SZAKIK, RANDOM SZABAD IDŐKKEL */

window.SzakiAdatok = (function () {
    // --- random szabad kapacitás 2026.01.15 – 2026.02.27 között, 2–4 hét ---
    function randomHoliday() {
        const startBase = new Date("2026-01-15");
        const maxStartOffsetDays = 20; // 15–(15+20) = 15–35 → bőven február eleje
        const minLen = 14;             // 2 hét
        const maxLen = 28;             // 4 hét

        const startOffset = Math.floor(Math.random() * maxStartOffsetDays);
        const len = Math.floor(Math.random() * (maxLen - minLen + 1)) + minLen;

        const d1 = new Date(startBase.getTime() + startOffset * 86400000);
        const d2 = new Date(d1.getTime() + len * 86400000);

        function clampToInterval(date) {
            const min = new Date("2026-01-15");
            const max = new Date("2026-02-27");
            if (date < min) return min;
            if (date > max) return max;
            return date;
        }

        const from = clampToInterval(d1);
        const to = clampToInterval(d2);

        const fY = from.getFullYear();
        const fM = String(from.getMonth() + 1).padStart(2, "0");
        const fD = String(from.getDate()).padStart(2, "0");

        const tY = to.getFullYear();
        const tM = String(to.getMonth() + 1).padStart(2, "0");
        const tD = String(to.getDate()).padStart(2, "0");

        return {
            from: `${fY}.${fM}.${fD}`,
            to: `${tY}.${tM}.${tD}`
        };
    }

    // --- névlisták szakmánként (demó szakik) ---
    const namesByProfession = {
        "Kőműves": [
            "Demó Kőműves 1",
            "Demó Kőműves 2",
            "Demó Kőműves 3",
            "Demó Kőműves 4",
            "Demó Kőműves 5",
            "Demó Kőműves 6",
            "Demó Kőműves 7",
            "Demó Kőműves 8",
            "Demó Kőműves 9"
        ],
        "Festő": [
            "Demó Festő 1",
            "Demó Festő 2",
            "Demó Festő 3",
            "Demó Festő 4",
            "Demó Festő 5",
            "Demó Festő 6",
            "Demó Festő 7",
            "Demó Festő 8",
            "Demó Festő 9",
            "Demó Festő 10",
            "Demó Festő 11",
            "Demó Festő 12",
            "Demó Festő 13",
            "Demó Festő 14"
        ],
        "Burkoló": [
            "Demó Burkoló 1",
            "Demó Burkoló 2",
            "Demó Burkoló 3",
            "Demó Burkoló 4",
            "Demó Burkoló 5",
            "Demó Burkoló 6",
            "Demó Burkoló 7",
            "Demó Burkoló 8",
            "Demó Burkoló 9",
            "Demó Burkoló 10",
            "Demó Burkoló 11",
            "Demó Burkoló 12",
            "Demó Burkoló 13",
            "Demó Burkoló 14",
            "Demó Burkoló 15",
            "Demó Burkoló 16",
            "Demó Burkoló 17"
        ],
        "Gipszkartonszerelő": [
            "Demó Gipszkartonos 1",
            "Demó Gipszkartonos 2",
            "Demó Gipszkartonos 3",
            "Demó Gipszkartonos 4",
            "Demó Gipszkartonos 5",
            "Demó Gipszkartonos 6",
            "Demó Gipszkartonos 7",
            "Demó Gipszkartonos 8",
            "Demó Gipszkartonos 9",
            "Demó Gipszkartonos 10",
            "Demó Gipszkartonos 11",
            "Demó Gipszkartonos 12",
            "Demó Gipszkartonos 13",
            "Demó Gipszkartonos 14",
            "Demó Gipszkartonos 15",
            "Demó Gipszkartonos 16",
            "Demó Gipszkartonos 17",
            "Demó Gipszkartonos 18",
            "Demó Gipszkartonos 19"
        ],
        "Vízszerelő": [
            "Demó Vízszerelő 1",
            "Demó Vízszerelő 2",
            "Demó Vízszerelő 3"
        ],
        "Gázszerelő": [
            "Demó Gázszerelő 1",
            "Demó Gázszerelő 2",
            "Demó Gázszerelő 3",
            "Demó Gázszerelő 4",
            "Demó Gázszerelő 5",
            "Demó Gázszerelő 6",
            "Demó Gázszerelő 7",
            "Demó Gázszerelő 8"
        ],
        "Villanyszerelő": [
            "Demó Villanyszerelő 1",
            "Demó Villanyszerelő 2",
            "Demó Villanyszerelő 3",
            "Demó Villanyszerelő 4",
            "Demó Villanyszerelő 5",
            "Demó Villanyszerelő 6",
            "Demó Villanyszerelő 7",
            "Demó Villanyszerelő 8",
            "Demó Villanyszerelő 9",
            "Demó Villanyszerelő 10"
        ]
    };

    const szakik = [];

    // --- VALÓDI SZAKIK: CSABI több szakmában, ZSOLTI festőként ---
    const csabiPhone = "+36305902316";
    const zsoltPhone = "+36306566793";

    const csabiProfs = [
        "Kőműves",
        "Festő",
        "Burkoló",
        "Gipszkartonszerelő"
    ];

    csabiProfs.forEach(prof => {
        szakik.push({
            name: "Csabi",
            profession: prof,
            phone: csabiPhone,
            isReal: true,
            isDemo: false,
            holidays: randomHoliday(),
            note: "Teljes lakásfelújítást is vállalok."
        });
    });

    szakik.push({
        name: "Zsolti",
        profession: "Festő",
        phone: zsoltPhone,
        isReal: true,
        isDemo: false,
        holidays: randomHoliday(),
        note: "Minőségi festés, gyors határidővel."
    });

    // --- DEMÓ SZAKIK FELTÖLTÉSE (nem elérhetők) ---
    Object.keys(namesByProfession).forEach(prof => {
        namesByProfession[prof].forEach(demoName => {
            szakik.push({
                name: demoName,
                profession: prof,
                phone: "06-30-***-****",
                isReal: false,
                isDemo: true,
                holidays: randomHoliday(),
                note: "Demó profil – csak minta, jelenleg nem elérhető."
            });
        });
    });

    // --- NYILVÁNOS API ---
    return {
        getAllSzakik: () => szakik,

        // Tel.szám megjelenítése
        getDisplayPhone: (szaki) => {
            if (szaki.isReal) {
                return szaki.phone; // Csabi, Zsolti: mindig látható
            }
            // demó szakik: nem publikus
            return "Nem publikus – regisztrálj szakinak!";
        },

        // Naptár szöveg
        getHolidayLabel: (szaki) => {
            return `Mikor tud új munkát vállalni: ${szaki.holidays.from} – ${szaki.holidays.to}`;
        }
    };
})();
