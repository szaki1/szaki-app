/* szaki-adatok.js – VALÓDI + DEMÓ SZAKIK, RANDOM SZABAD IDŐKKEL */

window.SzakiAdatok = (function () {
    // --- random szabad kapacitás 2026.01.15 – 2026.02.27 között, 2–4 hét ---
    function randomHoliday() {
        const startBase = new Date("2026-01-15");
        const maxStartOffsetDays = 20;
        const minLen = 14; // 2 hét
        const maxLen = 28; // 4 hét

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

    // --- névlisták szakmánként (IGAZI hangzású nevek, darabszám: 10 / 15 / 18 / 20 / 4 / 9 / 11) ---
    const namesByProfession = {
        "Kőműves": [
            "Kiss József",
            "Nagy Péter",
            "Tóth László",
            "Szabó András",
            "Farkas Zoltán",
            "Varga Gábor",
            "Balogh Imre",
            "Molnár Attila",
            "Horváth Béla",
            "Kovács Sándor"
        ],
        "Festő": [
            "Kovács István",
            "Szűcs Tamás",
            "Simon Gergely",
            "Vass Balázs",
            "Török Máté",
            "Oláh Róbert",
            "Kelemen Dávid",
            "Takács Norbert",
            "Veres György",
            "Papp Lajos",
            "Bíró Richárd",
            "Hegyi Csaba",
            "Major Attila",
            "Balla Zsolt",
            "Csizmadia József"
        ],
        "Burkoló": [
            "Fekete Zoltán",
            "Szalai Tamás",
            "Lukács Gábor",
            "Fehér László",
            "Gulyás Péter",
            "Németh Attila",
            "Somogyi Krisztián",
            "Kocsis József",
            "Jakab Dániel",
            "Orbán László",
            "Gelencsér Zsolt",
            "Sándor Róbert",
            "Vincze András",
            "Hajdu Gergely",
            "Illés Márk",
            "Lengyel Zoltán",
            "Bognár Bence",
            "Pintér Ádám"
        ],
        "Gipszkartonszerelő": [
            "Szilágyi Zsolt",
            "Fodor Máté",
            "Barta Gábor",
            "Csabai Tamás",
            "Pataki Imre",
            "Berki Zoltán",
            "Sárai Gergely",
            "Király László",
            "Oláh Ádám",
            "Kalmár Norbert",
            "Balla Krisztián",
            "Márton Róbert",
            "Győrfi László",
            "Nyári Dániel",
            "Süli Péter",
            "Vígh Csaba",
            "Lesti Bence",
            "Nagy Máté",
            "Oláh Dániel",
            "Simon Péter"
        ],
        "Vízszerelő": [
            "Kozma József",
            "Fekete Gergő",
            "Pál László",
            "Szerencsi Norbert"
        ],
        "Gázszerelő": [
            "Dudás István",
            "Révész Gábor",
            "Kereki Zsolt",
            "Kiss Norbert",
            "Bognár Tamás",
            "Makai László",
            "Kovács Róbert",
            "Farkas Attila",
            "Szabó Gergely"
        ],
        "Villanyszerelő": [
            "Kálmán Bence",
            "László Tamás",
            "Vincze Zoltán",
            "Füredi Gábor",
            "Böhm Norbert",
            "Török Sándor",
            "Dani István",
            "Kerekes Balázs",
            "Nádasdi Péter",
            "Major László",
            "Fülöp Márton"
        ]
    };

    const szakik = [];

    // --- VALÓDI SZAKIK: CSABI több szakmában, ZSOLTI villanyszerelőként ---
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

    // Zsolti: CSAK villanyszerelő
    szakik.push({
        name: "Zsolti",
        profession: "Villanyszerelő",
        phone: zsoltPhone,
        isReal: true,
        isDemo: false,
        holidays: randomHoliday(),
        note: "Minőségi villanyszerelés, gyors határidővel."
    });

    // --- DEMÓ SZAKIK FELTÖLTÉSE (nem elérhetők – lezárt naptárral) ---
    Object.keys(namesByProfession).forEach(prof => {
        namesByProfession[prof].forEach(fullName => {
            szakik.push({
                name: fullName,
                profession: prof,
                phone: "Nem publikus",
                isReal: false,
                isDemo: true,
                holidays: randomHoliday(),
                note: "Jelenleg be van táblázva, nem fogad új munkát."
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
            return "Nem publikus – regisztrálj szakinak a Szaki-Appon!";
        },

        // Naptár / elérhetőség szöveg
        getHolidayLabel: (szaki) => {
            if (szaki.name === "Csabi") {
                return "Elérhető - Vedd fel vele a kapcsolatot telefonon: +36305902316 vagy itt a chat-en!";
            }
            if (szaki.name === "Zsolti") {
                return "Elérhető - Vedd fel vele a kapcsolatot telefonon: +36306566793 vagy itt a chat-en!";
            }
            // mindenki másnál dátum intervallum
            return `Mikor tud új munkát vállalni: ${szaki.holidays.from} – ${szaki.holidays.to}`;
        }
    };
})();
