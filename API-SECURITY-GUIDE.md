# 🔐 API Kulcsok Biztonsági Útmutató

## Firebase API Kulcs

### ⚠️ FONTOS
A Firebase API kulcs **PUBLIKUSAN** látható a frontend kódban - **ez normális és biztonságos**!

### Miért biztonságos?
- Firebase API kulcs csak **azonosítja** a projektet
- Az adatvédelem **Firestore Security Rules** biztosítja
- A kulcs korlátozható domain-re

### 🛡️ VÉDELEM BEÁLLÍTÁSA

1. Menj a [Firebase Console](https://console.firebase.google.com/) → Projekt kiválasztása
2. Project Settings (⚙️) → General tab
3. Görgess le a "Web API Key" részhez
4. Kattints "API key restrictions" linkre
5. Állítsd be:
   - **Application restrictions**: HTTP referrers (web sites)
   - **Website restrictions**: Add hozzá:
     ```
     szakichat-ai.web.app/*
     szakichat-ai.firebaseapp.com/*
     localhost:5000/*
     ```

### ✅ Ellenőrzés
- Próbálj Firebase-hoz csatlakozni MÁSIK domain-ről → blokkolva lesz
- Saját oldalról → működik

---

## Gemini AI API Kulcs

### ⚠️ KRITIKUS BIZTONSÁGI PROBLÉMA
A Gemini API kulcs **TITKOS** kellene legyen, de jelenleg publikusan látható!

### 🔴 Jelenlegi helyzet
- Kulcs: `AIzaSyCRvuIN8UZtCIsXIMSp0qZolgvkHWYPm-M`
- Használat: `dashboard.html` (Facebook screenshot validáció)
- Veszély: **Bárki visszaélhet vele, quota kimerülhet**

### 🛡️ IDEIGLENES VÉDELEM (Azonnal végezd el!)

1. Menj [Google Cloud Console](https://console.cloud.google.com/)
2. API & Services → Credentials
3. Keresd meg a kulcsot
4. **API restrictions**: 
   - Csak **Generative Language API**
5. **Application restrictions**:
   - HTTP referrers:
     ```
     szakichat-ai.web.app/*
     szakichat-ai.firebaseapp.com/*
     ```

### ✅ VÉGLEGES MEGOLDÁS: Backend Proxy

**Firebase Cloud Functions endpoint készítése:**

```javascript
// functions/index.js
const functions = require('firebase-functions');
const fetch = require('node-fetch');

exports.checkImageWithAI = functions.https.onCall(async (data, context) => {
  // Autentikáció ellenőrzés
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Nincs bejelentkezve');
  }
  
  const { base64ImageData } = data;
  const GEMINI_API_KEY = functions.config().gemini.key; // Titkos környezeti változó
  
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: "Facebook screenshot validáció..." },
            { inline_data: { mime_type: "image/jpeg", data: base64ImageData } }
          ]
        }]
      })
    }
  );
  
  return await response.json();
});
```

**Frontend módosítás:**

```javascript
// dashboard.html
import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();
const checkImageWithAI = httpsCallable(functions, 'checkImageWithAI');

async function validateScreenshot(base64Data) {
  const result = await checkImageWithAI({ base64ImageData: base64Data });
  return result.data;
}
```

**Telepítés:**
```bash
firebase functions:config:set gemini.key="AIzaSyCRvuIN8UZtCIsXIMSp0qZolgvkHWYPm-M"
firebase deploy --only functions
```

---

## 📊 Költség Monitoring

### Firebase Quota
- Spark Plan: Ingyenes, de korlátozott
- Blaze Plan: Pay-as-you-go
- [Monitoring](https://console.firebase.google.com/) → Usage

### Gemini AI Quota
- Free tier: 15 requests/minute, 1500/day
- [Monitoring](https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com/quotas)

### 🚨 Riasztások beállítása
1. Cloud Console → Billing → Budgets & alerts
2. Állíts be költségkeretet (pl. $10/hó)
3. Email riasztás ha 50%, 80%, 100% elérés

---

## ✅ Ellenőrző lista

- [ ] Firebase API key domain korlátozás beállítva
- [ ] Gemini API key domain korlátozás beállítva (ideiglenes)
- [ ] Cloud Functions backend proxy tervezve (végleges)
- [ ] Firestore Security Rules szigorítva
- [ ] Költségfigyelés beállítva
- [ ] API kulcsok dokumentálva (csak ez a fájl!)

---

## 📞 Segítség
Ha bármilyen kérdésed van:
- Firebase Support: https://firebase.google.com/support
- Google Cloud Support: https://cloud.google.com/support

**SOHA ne oszd meg az API kulcsokat nyilvánosan (GitHub, Discord, stb.)!**
