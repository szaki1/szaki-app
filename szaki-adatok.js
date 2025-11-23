// szaki-adatok.js
// Szakik adatbázisa. Csabi + Zsolt: látható telefonszám.
// Mindenki más: maszkolt szám, és 2026.01.15–02.28 között 2–3 hét random szabadnap.

////////////////////////////////////
// Segéd: dátum + determinisztikus random
////////////////////////////////////

const HOLIDAY_GLOBAL_START = { year: 2026, month: 1, day: 15 };
const HOLIDAY_GLOBAL_END = { year: 2026, month: 2, day: 28 };
const MS_PER_DAY = 24 * 60 * 60 * 1000;

// Determinisztikus PRNG – minden betöltésnél ugyanaz eredmény
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeJsDate(obj) {
  return new Date(obj.year, obj.month - 1, obj.day);
}
function addDays(baseDate, offsetDays) {
  return new Date(baseDate.getTime() + offsetDays * MS_PER_DAY);
}
function formatDate(dateObj, sep) {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, "0");
  const d = String(dateObj.getDate()).padStart(2, "0");
  return sep === "." ? `${y}.${m}.${d}` : `${y}-${m}-${d}`;
}

// 2–3 hét random szabadnap generálása egyedi seed alapján
function createRandomHoliday(seed) {
  const rand = mulberry32(seed);

  const globalStart = makeJsDate(HOLIDAY_GLOBAL_START);
  const globalEnd = makeJsDate(HOLIDAY_GLOBAL_END);

  const totalDays = Math.round((globalEnd - globalStart) / MS_PER_DAY); // 44 nap

  const minLen = 14; // 2 hét
  const maxLen = 21; // 3 hét

  const lengthDays = minLen + Math.floor(rand() * (maxLen - minLen + 1)); // 14–21
  const maxStartOffset = totalDays - (lengthDays - 1);

  const startOffset = Math.floor(rand() * (maxStartOffset + 1));
  const startDate = addDays(globalStart, startOffset);
  const endDate = addDays(startDate, lengthDays - 1);

  const holidayFrom = formatDate(startDate, "-");
  const holidayTo = formatDate(endDate, "-");
  const labelFrom = formatDate(startDate, ".");
  const labelTo = formatDate(endDate, ".");

  return {
    holidayFrom,
    holidayTo,
    fullHolidayText: `Szabadnap: ${labelFrom} – ${labelTo}.`,
  };
}

//////////////////////////////////////
// Csabi + Zsolt – látható telefonszám
//////////////////////////////////////

const SPECIAL_SZAKIK_BASE = [
  {
    id: "zsolt",
    name: "Vaskó Zsolt Tamás",
    displayName: "Zsolt",
    profession: "Villanyszerelő",
    roleTitle: "Kiemelt villanyszerelő – Zsolt",
    badges: ["Igazolt villanyszerelő", "Kiemelt partner"],
    phone: "+36 30 656 6793",
    phoneVisible: true,
  },
  {
    id: "csabi",
    name: "Csabi",
    displayName: "Csabi",
    profession: "Kőműves",
    roleTitle: "Kiemelt kőműves mester – Csabi",
    badges: ["Igazolt kőműves mester", "Kiemelt partner"],
    phone: "+36 30 590 2316",
    phoneVisible: true,
  },
];

// hozzáadjuk a random szabadnapot is
const SPECIAL_SZAKIK = SPECIAL_SZAKIK_BASE.map((szaki, index) => {
  const holiday = createRandomHoliday(index + 1);
  return { ...szaki, ...holiday };
});

//////////////////////////////////////
// Demó szakik generálása
//////////////////////////////////////

const DEMO_COUNTS = [
  { profession: "Kőműves", count: 10 },
  { profession: "Festő", count: 15 },
  { profession: "Burkoló", count: 18 },
  { profession: "Gipszkartonszerelő", count: 20 },
  { profession: "Vízszerelő", count: 4 },
  { profession: "Gázszerelő", count: 9 },
  { profession: "Villanyszerelő", count: 11 },
];

const LAST_NAMES = [
  "Kiss", "Nagy", "Szabó", "Tóth", "Kovács", "Varga",
  "Lakatos", "Balogh", "Molnár", "Farkas", "Horváth",
  "Simon", "Fekete", "Boros"
];

const FIRST_NAMES = [
  "János", "Péter", "László", "Gábor", "Tamás", "Zoltán",
  "Attila", "István", "Miklós", "József", "Róbert",
  "Bence", "Ádám", "Csaba"
];

let demoIdCounter = 1;

function createDemoSzaki(profession, indexInProfession) {
  const last =
    LAST_NAMES[(demoIdCounter + indexInProfession) % LAST_NAMES.length];
  const first =
    FIRST_NAMES[(demoIdCounter * 3 + indexInProfession) % FIRST_NAMES.length];

  const id = `demo_${profession.toLowerCase()}_${demoIdCounter}`;
  const seed = 1000 + demoIdCounter * 7 + indexInProfession;
  demoIdCounter++;

  const holiday = createRandomHoliday(seed);

  return {
    id,
    name: `${last} ${first}`,
    displayName: first,
    profession,
    roleTitle: `${profession} szakember`,
    badges: ["Regisztrált szaki", "Demó profil"],
    phone: null,
    phoneVisible: false,
    maskedPhone: "+36 30 *** ** ***",
    reachable: false,
    ...holiday,
  };
}

const DEMO_SZAKIK = [];
DEMO_COUNTS.forEach(({ profession, count }) => {
  for (let i = 0; i < count; i++) {
    DEMO_SZAKIK.push(createDemoSzaki(profession, i));
  }
});

//////////////////////////////////////
// Végső lista
//////////////////////////////////////

const ALL_SZAKIK = [...SPECIAL_SZAKIK, ...DEMO_SZAKIK];

//////////////////////////////////////
// Publikus függvények
//////////////////////////////////////

function getDisplayPhone(szaki) {
  if (szaki.phoneVisible && szaki.phone) return szaki.phone;
  return szaki.maskedPhone;
}

function getHolidayLabel(szaki) {
  return szaki.fullHolidayText;
}

function getAllSzakik() {
  return ALL_SZAKIK;
}

window.SzakiAdatok = {
  getAllSzakik,
  getDisplayPhone,
  getHolidayLabel,
};
