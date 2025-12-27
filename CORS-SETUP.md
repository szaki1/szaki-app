# Firebase Storage CORS Beállítás

## Probléma
A szakichat.hu domain-ről nem tudja elérni a Firebase Storage-t CORS policy miatt.

## Megoldás Lépései

### 1. Firebase Storage Aktiválás
1. Nyisd meg: https://console.firebase.google.com/project/szakichat-ai/storage
2. Kattints "Get Started" gombra
3. Válaszd ki a régiót (pl. europe-west3)
4. Kattints "Done"

### 2. Storage Rules Telepítés
```bash
firebase deploy --only storage
```

### 3. CORS Konfiguráció (gsutil szükséges)

#### A. gsutil Telepítés
Telepítsd a Google Cloud SDK-t:
https://cloud.google.com/sdk/docs/install

#### B. Bejelentkezés
```bash
gcloud auth login
gcloud config set project szakichat-ai
```

#### C. CORS Feltöltés
```bash
cd "c:\Users\chisn\Desktop\szakichat-ai-web"
gsutil cors set cors.json gs://szakichat-ai.appspot.com
```

#### D. CORS Ellenőrzés
```bash
gsutil cors get gs://szakichat-ai.appspot.com
```

## cors.json Tartalom
```json
[
  {
    "origin": ["https://szakichat.hu", "https://www.szakichat.hu", "https://szakichat-ai.web.app", "https://szakichat-ai.firebaseapp.com"],
    "method": ["GET", "POST", "PUT", "DELETE", "HEAD"],
    "maxAgeSeconds": 3600,
    "responseHeader": ["Content-Type", "Authorization", "Content-Length", "User-Agent", "X-Requested-With"]
  }
]
```

## Gyors Megoldás (Alternatíva)
Ha nincs gsutil, akkor a Firebase Console-ban:
1. Storage → Rules → Módosítsd:
```
allow read, write: if request.auth != null;
```

2. Storage CORS beállítás - csak a gsutil paranccsal lehetséges!
