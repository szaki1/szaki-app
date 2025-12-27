

# SzakiChat AI Web – Copilot Agent Útmutató

## Alapvető projektismeretek

- **Nincs build, npm vagy transzpilálás.** Minden kód natívan, ES6 modulokként fut a böngészőben. Szerkeszd a `public/` fájlokat, frissítsd a böngészőt, kész.
- **Csak Firebase v10.12.2 (CDN).** Soha ne inicializáld újra a Firebaset. Mindig a `public/firebase-config.js`-ből importálj.
- **Felhasználói szerepek:** `szaki` (szakember) és `megrendelo` (ügyfél). A fake szakik (`isFake: true`) csak marketingre valók—soha ne engedj bejelentkezést vagy online státuszt nekik.
- **Determinista chat ID:** Mindig `uid1 < uid2 ? uid1_uid2 : uid2_uid1` mintát használj chat dokumentum ID-hoz. Soha ne randomizálj vagy hash-elj.
- **Inbox optimalizálás:** Soha ne kérdezd le az összes üzenetet az inboxhoz. Használd a `unreadCountSzaki`/`unreadCountMegr` mezőket a chat doksiban.
- **Soha ne használd a `profession` mezőt.** Mindig a `szakma` mezőt használd (lásd 2024. dec. egységesítés).
- **Minden UI és komment magyarul.** Változó- és függvénynév angolul.

## Architektúra & minták

- **Frontend:** Vanilla JS ES6 modulok, logika HTML-ben `<script type="module">`-ben (pl. `public/chat.html`, `public/dashboard.html`).
- **Firebase:** Firestore (real-time), Storage, Auth. Minden elérés: `public/firebase-config.js`.
- **PWA:** Service Worker (`public/sw.js`), manifest, badge frissítés (`public/badge-manager.js`).
- **Jelenlét:** `public/presence.js` frissíti a `users/{uid}` doksit `online` és `lastActive` mezőkkel. Fake szakikat mindig hagyd ki az online számlálóból.
- **Értesítések:** `public/notifications.js` böngésző push/hang. Mobil hanghoz hívd: `initNotificationAudio()` felhasználói gesztus után.
- **AI integráció:** Gemini API moderáció/validáció (lásd: `public/dashboard.html`, `public/chat.html`). API kulcs publikus; védelem: `API-SECURITY-GUIDE.md`.
- **Biztonság:** Minden hozzáférést Firestore/Storage szabályok védenek. Admin: `chisnyan@gmail.com` (lásd: `firestore.rules`).

## Fejlesztői workflow

- **Helyi fejlesztés:**
  ```bash
  cd "c:\Users\chisn\Desktop\szakichat-ai-web"
  firebase serve  # http://localhost:5000
  ```
- **Deploy:**
  ```bash
  firebase deploy --only hosting
  ```
- **Biztonsági szabályok frissítése:**
  ```bash
  firebase deploy --only firestore:rules
  ```
- **Nincs build lépés.** Szerkesztés, frissítés, deploy.

## Projekt-specifikus konvenciók

- **Firebase import:**
  ```js
  import { auth, db } from "./firebase-config.js";
  ```
- **Chat ID minta:**
  ```js
  const chatId = myUid < partnerId ? `${myUid}_${partnerId}` : `${partnerId}_${myUid}`;
  ```
- **Online számlálás (fake szakik nélkül):**
  ```js
  const onlineCount = allUsers.filter(u => u.role === "szaki" && u.online && !u.isFake).length;
  ```
- **Olvasatlan üzenetek (inbox):**
  ```js
  const unread = chatDoc.data().unreadCountSzaki || 0;
  ```
- **Név formázás:**
  ```js
  function formatName(fullName) {
    const p = fullName.trim().split(" ");
    return p.length === 1 ? p[0] : `${p[0][0]}. ${p.slice(1).join(" ")}`;
  }
  ```

## Fájl/komponens térkép

- **Auth guard:** `public/auth-guard.js` (szerep/oldal védelem)
- **Jelenlét:** `public/presence.js`
- **Értesítések:** `public/notifications.js`, `public/badge-manager.js`, `public/sw.js`
- **Chat logika:** Inline a `public/chat.html`-ben (nem `chat.js`)
- **Admin:** `public/admin.html`, `importFakeProfessionals.js`
- **Biztonsági szabályok:** `firestore.rules`, `storage.rules`

## Gyakori hibák

- Soha ne használd vagy hozd létre a `profession` mezőt—csak `szakma`!
- Soha ne inicializáld újra a Firebaset (`firebase-config.js`)
- Soha ne számold a fake szakikat online-nak
- Soha ne kérdezd le az összes üzenetet inboxhoz—használd az olvasatlan számlálót
- Soha ne tegyél ki új API kulcsot (`API-SECURITY-GUIDE.md`)

## Példa: új oldal hozzáadása

1. Hozz létre HTML-t a `public/` mappában
2. Importáld a Firebaset a `firebase-config.js`-ből
3. Adj hozzá `<script type="module" src="./auth-guard.js"></script>`-t, ha auth kell
4. Adj hozzá `<script type="module" src="./presence.js"></script>`-t, ha online követés kell
5. Frissítsd a `PAGE_ROLE_MAP`-et az `auth-guard.js`-ben, ha szerephez kötött

---
További részletek: `API-SECURITY-GUIDE.md`, `firestore.rules`, illetve inline kód a `public/` mappában.
