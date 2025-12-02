// ======================================================================
//  SzakiChat – profile-save.js
//  Profil adatok mentése, frissítése Firestore-ban
// ======================================================================

import { db } from "./firebase-config.js";
import {
    doc,
    getDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


// ======================================================================
//  USER ADATOK LEKÉRÉSE
// ======================================================================
export async function getUserData(uid) {
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data() : null;
}


// ======================================================================
//  NÉV MENTÉSE
// ======================================================================
export async function saveName(uid, newName) {
    if (!newName.trim()) return { ok: false, msg: "Üres név!" };

    await updateDoc(doc(db, "users", uid), {
        name: newName
    });

    return { ok: true };
}


// ======================================================================
//  SZEREP MENTÉSE (szaki / megrendelo)
// ======================================================================
export async function saveRole(uid, role) {
    if (role !== "szaki" && role !== "megrendelo")
        return { ok: false, msg: "Érvénytelen szerep!" };

    await updateDoc(doc(db, "users", uid), {
        role
    });

    return { ok: true };
}


// ======================================================================
//  SZAKMA MENTÉSE (CSAK SZAKINÁL)
// ======================================================================
export async function saveSzakma(uid, szakma) {
    await updateDoc(doc(db, "users", uid), {
        szakma
    });

    return { ok: true };
}


// ======================================================================
//  MEGRENDELŐ – PREFERÁLT SZAKMA
// ======================================================================
export async function savePreferredSzakma(uid, preferred) {
    await updateDoc(doc(db, "users", uid), {
        preferredSzakma: preferred
    });

    return { ok: true };
}


// ======================================================================
//  LAKHELY / MEGYE / VÁROS
// ======================================================================
export async function saveLocation(uid, county, city) {
    await updateDoc(doc(db, "users", uid), {
        county,
        city
    });

    return { ok: true };
}


// ======================================================================
//  MEGOSZTÁS SZÁMLÁLÓ FRISSÍTÉSE
// ======================================================================
export async function addShare(uid) {
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);
    const data = snap.data();

    let count = Number(data.shareCount || 0);
    count++;
    if (count > 5) count = 5; // max 5 → feloldás

    const unlocked = count >= 5;

    await updateDoc(ref, {
        shareCount: count,
        phoneUnlocked: unlocked
    });

    return count;
}


// ======================================================================
//  AVATAR (későbbi bővítéshez)
// ======================================================================
export async function saveAvatar(uid, avatarUrl) {
    await updateDoc(doc(db, "users", uid), {
        avatar: avatarUrl
    });

    return { ok: true };
}
