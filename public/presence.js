// presence.js — ONLINE STÁTUSZ KEZELÉS

import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, updateDoc, serverTimestamp, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

let presenceInterval = null;

onAuthStateChanged(auth, async (user) => {
  // Töröljük az előző intervalt
  if (presenceInterval) {
    clearInterval(presenceInterval);
    presenceInterval = null;
  }

  if (!user) return;

  const userRef = doc(db, "users", user.uid);

  // Azonnal online státuszra állítás
  try {
    // Ne számoljuk a fake szakikat online-nak
    const userSnap = await getDoc(userRef);
    if (userSnap.exists() && userSnap.data().isFake) {
      return;
    }

    await updateDoc(userRef, {
      online: true,
      lastActive: serverTimestamp()
    });
  } catch (err) {
    console.error("❌ Presence init error:", err);
  }

  // Periodikusan frissítjük a lastActive mezőt (10 másodpercenként)
  presenceInterval = setInterval(async () => {
    try {
      const userSnap2 = await getDoc(userRef);
      if (userSnap2.exists() && userSnap2.data().isFake) return;
      await updateDoc(userRef, {
        online: true,
        lastActive: serverTimestamp()
      });
    } catch (err) {
      console.error("❌ Presence update error:", err);
    }
  }, 10000);

  // Amikor az oldal bezárul vagy a tab inaktív, offline-ra állítás
  const setOffline = async () => {
    try {
      await updateDoc(userRef, {
        online: false,
        lastActive: serverTimestamp()
      });
    } catch (err) {
      console.error("Presence offline error:", err);
    }
  };

  // Böngésző bezárása előtt
  window.addEventListener("beforeunload", setOffline);
  
  // Tab váltáskor is offline
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      setOffline();
    } else {
      updateDoc(userRef, {
        online: true,
        lastActive: serverTimestamp()
      }).catch(console.error);
    }
  });
});
