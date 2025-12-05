// FIREBASE IMPORT – EZ KELL HOZZÁ!
import { auth, db } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


// =============================================
//  MEGRENDELŐ REGISZTRÁCIÓ – VÉGLEGES VERZIÓ
// =============================================
window.registerUser = async function () {
  const name = document.getElementById("name").value.trim();
  const city = document.getElementById("city").value.trim().toLowerCase();
  const email = document.getElementById("email").value.trim();
  const pass1 = document.getElementById("pass1").value;
  const pass2 = document.getElementById("pass2").value;
  const phone = document.getElementById("phone").value.trim();

  // KÖTELEZŐ MEZŐK ELLENŐRZÉSE
  if (!name || !city || !email || !pass1 || !pass2 || !phone) {
    alert("Minden mező kötelező!");
    return;
  }

  if (pass1 !== pass2) {
    alert("A két jelszó nem egyezik!");
    return;
  }

  try {
    // Firebase auth – új felhasználó
    const userCred = await createUserWithEmailAndPassword(auth, email, pass1);
    const uid = userCred.user.uid;

    // Firestore profil létrehozása
    await setDoc(doc(db, "users", uid), {
      role: "user",          // FONTOS → megrendelő szerepkör
      name,
      city,
      phone,
      shareCount: 0,         // telefonküldés feloldása ehhez kötve
      online: false,
      chatList: {}           // későbbi chat rendszerhez kell
    });

    alert("Sikeres regisztráció!");

    // AUTOMATIKUS ÁTIRÁNYÍTÁS
    window.location.href = "user-chat-list.html";

  } catch (err) {
    alert("Hiba történt: " + err.message);
  }
};
