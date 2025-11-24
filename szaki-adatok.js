/* szaki-adatok.js – FRISSÍTETT VERZIÓ */

window.SzakiAdatok = (function () {

    // ---- SEGÉDFÜGGVÉNY: random szabadnapok ----
    function randomHoliday() {
        const start = new Date("2026-01-15");
        const end = new Date("2026-02-28");

        const days = Math.floor(Math.random() * 14) + 7; // 7–20 nap
        const startOffset = Math.floor(Math.random() * 20); // random kezdés

        const d1 = new Date(start.getTime() + startOffset * 86400000);
        const d2 = new Date(d1.getTime() + days * 86400000);

        return {
            from: d1.toISOString().split("T")[0],
            to: d2.toISOString().split("T")[0]
        };
    }

    // ---- SZAKIK LISTÁJA (RÖVID NÉVVEL A CHATHEZ) ----

    const szakik = [
        // ---- CSABI (mindig teljes telefonszámmal) ----
        {
            name: "Csabi",
            chatName: "Csabi",
            profession: "Kőműves",
            phone: "+36305902316",
            holidays: randomHoliday()
        },

        // ---- ZSOLTI (mindig teljes telefonszámmal) ----
        {
            name: "Zsolti",
            chatName: "Zsolti",
            profession: "Festő",
            phone: "+36306566793",
            holidays: randomHoliday()
        },

        // ---- TÖBBI SZAKI (csillagos telefonszámmal, rövid chatName) ----
        { name: "Kovács Béla", chatName: "Béla", profession: "Kőműves", phone: "06-30-***-****", holidays: randomHoliday() },
        { name: "Nagy Tamás", chatName: "Tamás", profession: "Kőműves", phone: "06-20-***-****", holidays: randomHoliday() },
        { name: "Farkas Imre", chatName: "Imre", profession: "Kőműves", phone: "06-70-***-****", holidays: randomHoliday() },

        { name: "Tóth Ádám", chatName: "Ádám", profession: "Festő", phone: "06-30-***-****", holidays: randomHoliday() },
        { name: "Balogh Sanyi", chatName: "Sanyi", profession: "Festő", phone: "06-20-***-****", holidays: randomHoliday() },
        { name: "Kelemen Norbi", chatName: "Norbi", profession: "Festő", phone: "06-70-***-****", holidays: randomHoliday() },

        { name: "Pintér Dénes", chatName: "Dénes", profession: "Burkoló", phone: "06-20-***-****", holidays: randomHoliday() },
        { name: "Szűcs Laci", chatName: "Laci", profession: "Burkoló", phone: "06-30-***-****", holidays: randomHoliday() },
        { name: "Varga Robi", chatName: "Robi", profession: "Burkoló", phone: "06-70-***-****", holidays: randomHoliday() },

        { name: "Szalai Gergő", chatName: "Gergő", profession: "Gipszkartonos", phone: "06-70-***-****", holidays: randomHoliday() },
        { name: "Molnár Józsi", chatName: "Józsi", profession: "Gipszkartonos", phone: "06-20-***-****", holidays: randomHoliday() },

        { name: "Hegedűs Bence", chatName: "Bence", profession: "Villanyszerelő", phone: "06-30-***-****", holidays: randomHoliday() },
        { name: "Oláh Krisz", chatName: "Krisz", profession: "Villanyszerelő", phone: "06-20-***-****", holidays: randomHoliday() },

        { name: "Kerekes Gyula", chatName: "Gyula", profession: "Vízszerelő", phone: "06-20-***-****", holidays: randomHoliday() },
        { name: "Fülöp Pali", chatName: "Pali", profession: "Vízszerelő", phone: "06-30-***-****", holidays: randomHoliday() },

        { name: "Lakatos Tivadar", chatName: "Tivadar", profession: "Gázszerelő", phone: "06-70-***-****", holidays: randomHoliday() },
        { name: "Barta Zsolt", chatName: "ZsoltB", profession: "Gázszerelő", phone: "06-20-***-****", holidays: randomHoliday() }
    ];

    // ---- PUBLIKUS FÜGGVÉNYEK ----

    return {
        getAllSzakik: () => szakik,

        getDisplayPhone: (szaki) => {
            if (szaki.name === "Csabi" || szaki.name === "Zsolti") {
                return szaki.phone; // mindig látható
            }
            return szaki.phone; // csillagos
        },

        getHolidayLabel: (s) => {
            return `Ezeken a napokon ráérek: ${s.holidays.from} – ${s.holidays.to}`;
        }
    };
})();
