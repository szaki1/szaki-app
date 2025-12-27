// login-szaki.js — VÉGLEGES, JAVÍTOTT (SZAKI BELÉPÉS + JELSZÓCSERE MŰKÖDIK)


import {
  auth,
  signInWithEmailAndPassword,
  db,
  doc,
  getDoc,
  setPersistence,
  browserLocalPersistence
} from "./firebase-config.js";

// 🔒 PERSISTENCE DEBUG
setPersistence(auth, browserLocalPersistence).then(()=>{
  console.log('✅ Auth persistence: browserLocalPersistence');
}).catch((err)=>{
  console.error('❌ Auth persistence hiba:', err);
});

import {
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const emailInput = document.getElementById("email");
const passInput  = document.getElementById("password");
const msg        = document.getElementById("msg");

/* 🔐 SZAKI BELÉPÉS */
window.loginSzaki = async () => {
  msg.textContent = "";
  msg.style.color = "red";

  const email = emailInput.value.trim();
  const pass  = passInput.value;

  if (!email || !pass) {
    msg.textContent = "Add meg az email címet és a jelszót!";
    return;
  }

  try {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    const uid = cred.user.uid;
    
    // Email mentése következő belépéshez
    localStorage.setItem('szakiEmail', email);

    const snap = await getDoc(doc(db, "users", uid));
    if (!snap.exists()) {
      msg.textContent = "Nincs felhasználói profil!";
      return;
    }

    const userData = snap.data();
    const { role, isFake, profilKitoltve } = userData;

    if (role !== "szaki") {
      msg.textContent = "Ez nem szakember fiók!";
      return;
    }

    if (isFake === true) {
      msg.textContent = "Ez egy álszaki fiók!";
      return;
    }

    // ✅ PROFIL ELLENŐRZÉS - Ha nincs kitöltve → profil kitöltésre irányít
    if (!profilKitoltve) {
      location.replace("szaki-profil-kitoltes.html");
      return;
    }

    location.replace("dashboard.html");

  } catch {
    msg.textContent = "Hibás email vagy jelszó!";
  }
};

/* 🔁 JELSZÓ VISSZAÁLLÍTÁS — JAVÍTVA */
window.resetPassword = async () => {
  msg.textContent = "";
  msg.style.color = "red";

  const email = emailInput.value.trim();
  if (!email) {
    msg.textContent = "Add meg az email címed!";
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    msg.style.color = "green";
    msg.textContent = "📧 Jelszó-visszaállító email elküldve.";
  } catch {
    msg.textContent = "Nem sikerült emailt küldeni.";
  }
};
