<!DOCTYPE html>
<html lang="hu">
<head>
<meta charset="UTF-8">
<title>SzakiChat – Szaki Dashboard</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<style>
body {
    margin:0; padding:0;
    background:#f2f2f2;
    font-family:Arial, sans-serif;
}

header {
    background:#007aff; color:white;
    padding:16px; text-align:center;
    font-size:22px; font-weight:bold;
}

.box {
    max-width:600px; margin:20px auto;
    background:white; padding:20px;
    border-radius:14px;
    box-shadow:0 4px 14px rgba(0,0,0,0.12);
}

h3 { margin-top:30px; }

.userItem {
    background:#fafafa;
    padding:14px;
    border-radius:10px;
    margin-bottom:12px;
    border:1px solid #ddd;
}

.btn {
    background:#007aff; color:white;
    border:none; border-radius:8px;
    padding:10px 15px;
    cursor:pointer; margin-top:8px;
}

.removeBtn {
    background:#ff3b30; color:white;
    border:none; border-radius:8px;
    padding:8px 12px; cursor:pointer;
}

/* ❤️ Adomány gomb */
#supportFloatingBtn {
    position: fixed; bottom:22px; right:22px;
    background:#ff2d55;
    padding:14px 22px;
    border-radius:40px;
    color:white;
    font-weight:bold;
    cursor:pointer;
    display:flex;
    align-items:center;
    gap:10px;
    box-shadow:0 4px 14px rgba(0,0,0,0.25);
}
.heart {
    animation: heartbeat 1.4s infinite;
}
@keyframes heartbeat {
    0%{transform:scale(1);}
    25%{transform:scale(1.25);}
    40%{transform:scale(1);}
    60%{transform:scale(1.25);}
    100%{transform:scale(1);}
}
</style>
</head>

<body>

<header>SzakiChat – Szaki Dashboard</header>

<div class="box">
    <h2 id="nameBox">Név...</h2>
    <div><b>Szakmák:</b> <span id="skillBox"></span></div>
    <div><b>Város:</b> <span id="cityBox"></span></div>
    <div><b>Állapot:</b> <span id="onlineBox">⚪ Offline</span></div>

    <h3>Aktív megrendelők:</h3>
    <div id="activeUsers"><i>Betöltés...</i></div>

    <h3>Új megkeresések:</h3>
    <div id="newUsers"><i>Figyelés…</i></div>
</div>

<!-- ❤️ ADOMÁNY GOMB -->
<div id="supportFloatingBtn"
     onclick="window.open('https://www.paypal.com/donate/?hosted_button_id=QGU3WXVSCH22A','_blank')">
    <span class="heart">❤️</span> Támogasd a SzakiChat-et
</div>

<!-- 🔥 Firebase config -->
<script type="module" src="firebase-config.js"></script>

<script type="module">

// ===============================
// FIREBASE IMPORT (JAVÍTVA!)
// ===============================
import { db, auth } from "./firebase-config.js";

import {
    doc, getDoc, updateDoc, setDoc,
    collection, query, where,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";


// ===============================
// GLOBÁLIS VÁLTOZÓK
// ===============================
let uid = null;
let szaki = null;
let activeChats = [];
let blockedUsers = [];


// ===============================
// BELÉPÉS FIGYELÉSE
// ===============================
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    uid = user.uid;

    await loadSzakiProfile();
    await setOnlineStatus(true);

    watchIncomingChats();
});


// ===============================
// SZAKI PROFIL BETÖLTÉSE
// ===============================
async function loadSzakiProfile() {
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
        alert("Hiba: nincs szaki profil!");
        return;
    }

    szaki = snap.data();
    activeChats = szaki.activeChats || [];
    blockedUsers = szaki.blockedUsers || [];

    document.getElementById("nameBox").innerText = szaki.name;
    document.getElementById("skillBox").innerText = (szaki.skills || []).join(", ");
    document.getElementById("cityBox").innerText = szaki.city;
    document.getElementById("onlineBox").innerText = "🟢 Online";

    renderActiveUsers();
}


// ===============================
// ONLINE ÁLLAPOT FIRESTORE-BE
// ===============================
async function setOnlineStatus(state) {
    await updateDoc(doc(db, "users", uid), {
        online: state,
        lastSeen: Date.now()
    });
}


// ===============================
// AKTÍV MEGRENDELŐK LISTÁJA
// ===============================
function renderActiveUsers() {
    const box = document.getElementById("activeUsers");
    box.innerHTML = "";

    if (activeChats.length === 0) {
        box.innerHTML = "<i>Nincs aktív beszélgetés.</i>";
        return;
    }

    activeChats.forEach(userID => {
        box.innerHTML += `
            <div class="userItem">
                <b>${userID}</b><br>
                <button class="btn" onclick="openChat('${userID}')">Chat megnyitása</button>
                <button class="removeBtn" onclick="removeUser('${userID}')">X</button>
            </div>
        `;
    });
}


// ===============================
// REALTIME ÚJ MEGKERESÉSEK
// ===============================
function watchIncomingChats() {
    const q = query(
        collection(db, "chats"),
        where("szakiID", "==", uid)
    );

    const newUsersBox = document.getElementById("newUsers");

    onSnapshot(q, (snapshot) => {
        newUsersBox.innerHTML = "";

        snapshot.forEach(docu => {
            const chat = docu.data();

            if (activeChats.includes(chat.userID)) return;
            if (blockedUsers.includes(chat.userID)) return;

            newUsersBox.innerHTML += `
                <div class="userItem">
                    <b>${chat.userName}</b><br>
                    <span class="small">Új megkeresés</span><br>
                    <button class="btn" onclick="acceptUser('${chat.userID}')">Elfogadás</button>
                    <button class="removeBtn" onclick="rejectUser('${chat.userID}')">X</button>
                </div>
            `;
        });
    });
}


// ===============================
// ELFGOADÁS
// ===============================
window.acceptUser = async function(userID) {
    if (activeChats.length >= 3) {
        alert("Egyszerre maximum 3 megrendelővel beszélhetsz!");
        return;
    }

    activeChats.push(userID);

    await updateDoc(doc(db, "users", uid), {
        activeChats
    });

    renderActiveUsers();
};


// ===============================
// ELUTASÍTÁS
// ===============================
window.rejectUser = async function(userID) {
    if (!blockedUsers.includes(userID)) {
        blockedUsers.push(userID);
    }

    await updateDoc(doc(db, "users", uid), {
        blockedUsers
    });

    alert("„Köszönöm a megbeszélést, 24 órán belül döntök.” elküldve!");
};


// ===============================
// TÖRLÉS
// ===============================
window.removeUser = async function(userID) {
    activeChats = activeChats.filter(x => x !== userID);

    if (!blockedUsers.includes(userID)) {
        blockedUsers.push(userID);
    }

    await updateDoc(doc(db, "users", uid), {
        activeChats,
        blockedUsers
    });

    renderActiveUsers();
};


// ===============================
// CHAT MEGNYITÁSA
// ===============================
window.openChat = function(userID) {
    window.location.href = `szaki-chat.html?partner=${userID}`;
};

</script>

</body>
</html>
