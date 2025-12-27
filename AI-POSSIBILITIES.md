# 🤖 AI Integráció - Lehetőségek és Ötletek

## 📍 JELENLEGI AI HASZNÁLAT

### 1. Facebook Screenshot Validáció (Gemini Vision)
**Hol:** `dashboard.html` - `checkImageWithAI()`  
**Feladat:** Ellenőrzi, hogy a feltöltött kép valódi Facebook megosztás-e a SzakiChat appról  
**Model:** Gemini 1.5 Flash Vision  
**Eredmény:** `{valid: true/false, reason: "..."}`

### 2. Üzenet Cenzúra (Gemini Text)
**Hol:** `chat.html` - `checkMessageWithAI()`  
**Feladat:** Felismeri ha a felhasználó elérhetőséget (telefon, email, social media) próbál megosztani  
**Model:** Gemini 1.5 Flash  
**Előny:** Kontextus-alapú, okosabb mint regex  
**Példa:** "06 30" → blokkolja, de "30 perc" → átengedi

---

## 💡 ÚJ AI LEHETŐSÉGEK

### 🌟 PRIORITÁS SZERINT

#### 1. **Automatikus Kategorizálás - Munkakör Felismerés** ⭐⭐⭐⭐⭐
**Probléma:** Szakik rossz szakmát választanak regisztrációkor  
**Megoldás:** AI elemzi a profil szöveget és ajánl szakmát

```javascript
// Példa használat
async function suggestProfession(description) {
  const prompt = `
Egy szakember így mutatkozott be:
"${description}"

Melyik szakmába tartozik? Válassz:
- Festő
- Burkoló
- Villanyszerelő
- Vízszerelő
- Gázszerelő
- Kőműves
- Ács
- Parkettás

Válaszolj csak a szakma nevével.
`;
  // Gemini API hívás...
}
```

**Hova:** `szaki-profil-kitoltes.html` - bemutatkozás mező után automatikus javaslat

---

#### 2. **Intelligens Szűrő - Munka Típus Felismerés** ⭐⭐⭐⭐⭐
**Probléma:** Megrendelők nem tudják pontosan megadni mit keresnek  
**Megoldás:** AI elemzi a keresési szöveget

```javascript
// Példa
Bemenet: "Ki tud fürdőszobát csempézni Budapesten?"
AI válasz: {
  szakma: "Burkoló",
  munkaTípus: "fürdőszoba csempézés",
  helyszín: "Budapest",
  sürgősség: null
}
```

**Hova:** `rooms.html` - keresőmező AI elemzéssel

---

#### 3. **Profilkép Validáció** ⭐⭐⭐⭐
**Probléma:** Fake profilok, nem valódi szakik  
**Megoldás:** AI ellenőrzi a profilképet

```javascript
// Gemini Vision
Prompt: "Ez a kép valódi személyt ábrázol? Nem rajz, AI generált vagy stock fotó?"
→ {valid: true/false, confidence: 0.95}
```

**Hova:** Profil szerkesztés / regisztráció

---

#### 4. **Chat Összefoglaló - Automatikus Lead Kinyerés** ⭐⭐⭐⭐
**Probléma:** Szakik nem jegyzetelik a beszélgetést  
**Megoldás:** AI összefoglalja a chat-et

```javascript
// Példa
Bemenet: 15 üzenet a chatből
AI válasz: {
  munkaTípus: "Konyha festés",
  méret: "20 m²",
  határidő: "jövő héten",
  költségkeret: "50-80 ezer Ft",
  sürgősség: "közepesen sürgős"
}
```

**Hova:** Chat oldal tetején "📊 Chat összefoglaló" gomb

---

#### 5. **Automatikus Válasz Javaslatok** ⭐⭐⭐⭐
**Probléma:** Szakik lassú válasz → veszít ügyfelet  
**Megoldás:** AI javasol gyors válaszokat

```javascript
// Példa
Megrendelő: "Mennyibe kerül 15m² fürdőszoba csempézés?"
AI javaslat:
- "20-30 ezer Ft/m², anyag nélkül. Megnézném a helyszínt?"
- "Hétvégén ráérek felmérni ingyen"
- "Van referencia munkám, küldöm fotót!"
```

**Hova:** Chat input mező alatt "🤖 Javasolt válaszok"

---

#### 6. **Sentiment Analysis - Elégedettség Mérés** ⭐⭐⭐
**Probléma:** Nem tudjuk a megrendelők elégedettségét  
**Megoldás:** AI elemzi a chat hangulatát

```javascript
// Példa
Chat elemzés után:
{
  sentiment: "positive", // positive/neutral/negative
  satisfaction: 0.85,    // 0-1 skála
  followUpNeeded: false
}
```

**Hova:** Admin panel - user experience tracking

---

#### 7. **Spam/Abuse Detektálás** ⭐⭐⭐⭐⭐
**Probléma:** Spam üzenetek, trágár beszéd  
**Megoldás:** AI moderáció

```javascript
// Gemini moderation
Prompt: "Ez az üzenet spam, trágár vagy sértő? '${message}'"
→ {blocked: true, reason: "trágár kifejezés"}
```

**Hova:** Üzenet küldés előtt (már van cenzúra, de bővíthető)

---

#### 8. **Képfelismerés - Munka Validáció** ⭐⭐⭐⭐
**Probléma:** Szakik random képeket töltenek fel referenciának  
**Megoldás:** AI ellenőrzi hogy valódi munka-e

```javascript
// Gemini Vision
Prompt: "Ez a kép festést/burkolást/szerelést ábrázol? Vagy csak random?"
→ {valid: true, workType: "fürdőszoba csempézés"}
```

**Hova:** Portfólió képek feltöltése

---

#### 9. **Árkalkulátor AI** ⭐⭐⭐
**Probléma:** Felhasználók nem tudják a piaci árakat  
**Megoldás:** AI becsüli a várható költséget

```javascript
// GPT/Gemini
Bemenet: {
  munkaTípus: "szoba festés",
  méret: 20, // m²
  város: "Budapest"
}
AI válasz: {
  becsültÁr: "60-80 ezer Ft",
  részletezés: "Festék: 15-20e, Munka: 45-60e"
}
```

**Hova:** Új "💰 Árkalkulátor" oldal

---

#### 10. **Voice-to-Text Fejlesztés** ⭐⭐⭐
**Probléma:** Jelenlegi mikrofon csak diktálás  
**Megoldás:** AI javítja a szöveget

```javascript
// Web Speech API + Gemini
Kimenet: "eee hát tudnál jönni holnap vagy úgy"
AI javítás: "Tudnál holnap jönni?"
```

**Hova:** Chat mikrofon funkció fejlesztése

---

#### 11. **Proaktív Értesítések** ⭐⭐⭐
**Probléma:** Szakik elfelejtenek válaszolni  
**Megoldás:** AI elemzi ki válaszolt lassú

```javascript
// Példa
if (lastMessageFrom === "megrendelo" && timeSince > 2 hours) {
  notify(szaki, "💬 Válaszolj gyorsabban, különben elveszted az ügyfelet!");
}
```

**Hova:** Background Cloud Function

---

#### 12. **Nyelvi Helyesírás Javítás** ⭐⭐
**Probléma:** Szakik helyesírási hibái professzionálisan hatnak  
**Megoldás:** AI javítja az üzenetet küldés előtt

```javascript
// Példa
Bemenet: "holnap tudok jöni megbeszéljük"
AI javítás: "Holnap tudok jönni, megbeszéljük?"
```

**Hova:** Chat input - opcionális "✅ Javítás" gomb

---

## 💰 KÖLTSÉG BECSLÉS

### Gemini API Pricing (2024-25)
- **Gemini 1.5 Flash**: 
  - Input: $0.075 / 1M characters
  - Output: $0.30 / 1M characters
  - Vision: $0.00015 / image

### Példa számítás (1000 felhasználó/nap):
- Screenshot validáció: 100 kép/nap → **$0.015/nap** = $0.45/hó
- Chat cenzúra: 5000 üzenet/nap, avg 100 char → **$0.0375/nap** = $1.13/hó
- **ÖSSZESEN: ~$2-5/hó** (kis forgalom esetén)

### Free Tier
- 15 requests/minute
- 1500 requests/day
- **→ Kezdésnek bőven elég!**

---

## 🚀 IMPLEMENTÁCIÓS SORREND

### Fázis 1: Biztonsági (AZONNAL)
1. ✅ API kulcsok domain korlátozás
2. ✅ Firestore rules szigorítás
3. Backend proxy készítése

### Fázis 2: User Experience (1-2 hét)
4. Spam/abuse detektálás fejlesztése
5. Automatikus válasz javaslatok
6. Profilkép validáció

### Fázis 3: Konverzió növelés (1 hónap)
7. Intelligens szűrő
8. Chat összefoglaló
9. Árkalkulátor

### Fázis 4: Tartós érték (2-3 hónap)
10. Munka validáció (képek)
11. Sentiment analysis
12. Kategorizálás fejlesztés

---

## 📊 VÁRHATÓ HATÁSOK

| Funkció | Konverzió növekedés | Fejlesztési idő |
|---------|---------------------|-----------------|
| Spam detektálás | +5-10% | 1 nap |
| Válasz javaslatok | +15-20% | 3 nap |
| Intelligens szűrő | +20-30% | 1 hét |
| Chat összefoglaló | +10-15% | 3 nap |
| Árkalkulátor | +25-40% | 1 hét |

---

## 🎯 AJÁNLÁS

**Kezdd ezzel (prioritási sorrend):**
1. **Backend proxy** (biztonság)
2. **Spam detektálás erősítése** (gyors win)
3. **Válasz javaslatok** (user experience)
4. **Intelligens szűrő** (legnagyobb hatás)
5. **Árkalkulátor** (marketing hook)

---

## 🔧 TECHNIKAI STACK

```
Frontend: Gemini SDK (CDN)
Backend: Firebase Cloud Functions
Model: Gemini 1.5 Flash (gyors + olcsó)
Vision: Gemini 1.5 Flash Vision
Fallback: OpenAI GPT-4o mini (ha Gemini limit)
```

---

**Kérdések? Segítség?**
- Gemini Docs: https://ai.google.dev/gemini-api/docs
- Firebase Functions: https://firebase.google.com/docs/functions
