// auth-guard.js — VÉGLEGES, TISZTA ROLE-VÉDELEM (NINCS PRESENCE)

import { auth, db, onAuthStateChanged, doc, getDoc } from "./firebase-config.js";

const PAGE_ROLE_MAP = {
  "dashboard.html": "szaki",
  "profile.html": "szaki",
  "chat.html": null,        // mindkettő beléphet (szaki + megrendelő)
  // "rooms.html": "megrendelo" // megszűnt, minden a megrendelo-profil.html-en
};

const currentPage = location.pathname.split("/").pop();

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    location.replace("index.html");
    return;
  }

  try {
    const snap = await getDoc(doc(db, "users", user.uid));
    if (!snap.exists()) {
      location.replace("index.html");
      return;
    }

    const { role, isFake } = snap.data();
    const requiredRole = PAGE_ROLE_MAP[currentPage];

    // álszaki soha
    if (role === "szaki" && isFake === true) {
      location.replace("index.html");
      return;
    }

    // ha az oldal szerepkört kér
    if (requiredRole && role !== requiredRole) {
      location.replace("index.html");
      return;
    }

  } catch {
    location.replace("index.html");
  }
});
