// Egyszerű, biztonságos szaki adatok és segédfüggvények a valassz-szakit.html számára.
// Másold be ezt a teljes fájlt a repó gyökerébe (felülírva az esetleg meglévőt).

(function () {
    // Példa adatok - bővíthető: name, profession, note, phone, isReal (boolean), holidays (opcionális)
    const SZAKIK = [
        {
            name: "Csabi",
            profession: "Festő",
            note: "",
            phone: "+36 20 123 4567",
            isReal: true
        },
        {
            name: "Zsolti",
            profession: "Villanyszerelő",
            note: "Gyors kis javítások, olcsó kiszállás",
            phone: "+36 30 765 4321",
            isReal: true
        },
        {
            name: "Demo Péter",
            profession: "Villanyszerelő",
            note: "Szabadság miatt nem elérhető",
            phone: "+36 70 111 2222",
            isReal: false,
            holidays: { from: "2025-08-01", to: "2025-08-20" }
        },
        {
            name: "Anna",
            profession: "Festő",
            note: "Több lakást is felújítottam",
            phone: "+36 20 999 8888",
            isReal: true
        }
    ];

    // Központi objektum exportálása ablakra
    window.SzakiAdatok = {
        // Visszaadja az összes szakembert (új objektum referencia nélkül)
        getAllSzakik: function () {
            // visszatérünk egy másolattal, hogy külső kód ne módosíthassa az eredeti tömböt
            return SZAKIK.map(s => Object.assign({}, s));
        },

        // Megjelenítésre alkalmas telefonszám: ha nincs, üres string
        getDisplayPhone: function (szaki) {
            if (!szaki) return "";
            if (szaki.phone && typeof szaki.phone === "string") {
                // egyszerű ellenőrzés: tördeld, de itt visszaadjuk a teljes stringet
                return szaki.phone;
            }
            return "";
        },

        // Visszaad egy olvasható nyaralás/hiányzás szöveget, vagy üres stringet
        getHolidayLabel: function (szaki) {
            if (!szaki) return "";
            const h = szaki.holidays;
            if (!h) return "";
            const from = h.from || "";
            const to = h.to || "";
            if (from && to) {
                return "Nyaralás: " + from + " – " + to;
            } else if (from) {
                return "Nyaralás kezdete: " + from;
            } else if (to) {
                return "Nyaralás vége: " + to;
            }
            return "";
        }
    };
})();
