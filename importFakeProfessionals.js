// -------------------------------------------------------------
// 87 FAKE SZAKI AUTOMATIKUS FELTÖLTÉS FIRESTORE-BA
// -------------------------------------------------------------

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyANKVxrmhFRm3BHDTtFzm6VwLTLLnwC8bs",
    authDomain: "szakichat-ai.firebaseapp.com",
    projectId: "szakichat-ai",
    storageBucket: "szakichat-ai.firebasestorage.app",
    messagingSenderId: "788780123554",
    appId: "1:788780123554:web:02357d45832906d46d1efb",
    measurementId: "G-0CR9LTBHQ5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const firstNames = [
    "Kovács", "Nagy", "Szabó", "Tóth", "Horváth", "Varga", "Kiss",
    "Molnár", "Balogh", "Farkas", "Takács", "Juhász", "Papp", "Lakatos",
    "Mészáros", "Oláh", "Simon", "Rácz", "Fekete"
];

const lastNames = [
    "István", "József", "László", "Zoltán", "Gábor", "Ferenc",
    "Tamás", "Sándor", "Péter", "Attila", "András", "Csaba",
    "Krisztián", "Miklós", "Bence", "Dávid"
];

const cities = ["Budapest", "Debrecen", "Győr", "Miskolc", "Pécs", "Szeged", "Kecskemét"];

const professions = [
    "Festő",
    "Burkoló",
    "Gipszkarton szerelő",
    "Vízszerelő",
    "Gázkészülék szerelő",
    "Villanyszerelő"
];

const generateLastSeen = () => {
    const options = ["2 perce", "15 perce", "1 órája", "3 órája", "17 órája", "1 napja"];
    return options[Math.floor(Math.random() * options.length)];
};

const generateAvatar = () => {
    const id = Math.floor(Math.random() * 70) + 1;
    return `https://i.pravatar.cc/150?img=${id}`;
};

async function seedFakeProfessionals() {
    const colRef = collection(db, "fakeProfessionals");

    for (let i = 0; i < 87; i++) {
        const docData = {
            name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${
                lastNames[Math.floor(Math.random() * lastNames.length)]
            }`,
            profession: professions[Math.floor(Math.random() * professions.length)],
            city: cities[Math.floor(Math.random() * cities.length)],
            rating: (Math.random() * (5 - 3.5) + 3.5).toFixed(1),
            online: Math.random() > 0.5,
            lastSeen: generateLastSeen(),
            avatar: generateAvatar()
        };

        await addDoc(colRef, docData);
        console.log(`Feltöltve: ${docData.name}`);
    }

    console.log("✔ Minden szaki feltöltve (87 db)!");
}

seedFakeProfessionals();
