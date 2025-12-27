// login-user.js — VÉGLEGES, JAVÍTOTT (MEGRENDELŐ BELÉPÉS, TISZTA ROUTING)


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

window.loginUser = async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Add meg az email címet és a jelszót!");
    return;
  }

  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const uid = cred.user.uid;
    
    // Email mentése következő belépéshez
    localStorage.setItem('megrEmail', email);

    const snap = await getDoc(doc(db, "users", uid));
    if (!snap.exists()) {
      alert("Nincs felhasználói profil!");
      return;
    }

    const data = snap.data();

    if (data.role !== "megrendelo") {
      alert("Ez nem megrendelői fiók!");
      return;
    }

    // Profil kitöltés ellenőrzése
    if (!data.profilKitoltve) {
      location.replace("megrendelo-profil-kitoltes.html");
      return;
    }

    location.replace("megrendelo-profil.html");

  } catch {
    alert("Hibás email vagy jelszó!");
  }
};
