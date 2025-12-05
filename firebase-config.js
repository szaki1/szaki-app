<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <title>Bejelentkezés – SzakiChat</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <style>
        body {
            margin:0;
            padding:0;
            background:#f2f2f2;
            font-family:Arial, sans-serif;
        }

        header {
            background:#007aff;
            color:white;
            padding:18px;
            text-align:center;
            font-size:22px;
            font-weight:bold;
        }

        .container {
            max-width:480px;
            margin:30px auto;
            padding:20px;
            background:white;
            border-radius:12px;
            box-shadow:0 4px 14px rgba(0,0,0,0.1);
        }

        label {
            font-weight:bold;
            margin-top:14px;
            display:block;
        }

        input {
            width:100%;
            padding:12px;
            margin-top:6px;
            border:1px solid #ccc;
            border-radius:8px;
            font-size:16px;
            background:#e9f1ff;
        }

        .btn {
            width:100%;
            padding:14px;
            margin-top:20px;
            background:#007aff;
            color:white;
            border:none;
            border-radius:8px;
            font-size:18px;
            cursor:pointer;
            font-weight:bold;
        }

        .btn-secondary {
            background:#ff8c00;
            margin-top:10px;
        }

        #supportFloatingBtn {
            position: fixed;
            bottom: 22px;
            right: 22px;
            padding:14px 22px;
            border-radius:40px;
            background:#ff2d55;
            color:white;
            font-weight:bold;
            cursor:pointer;
            box-shadow:0 4px 14px rgba(0,0,0,0.25);
        }
    </style>
</head>

<body>

<header>Bejelentkezés</header>

<div class="container">

    <label>Email cím</label>
    <input id="email" type="email" placeholder="Add meg az email címed">

    <label>Jelszó</label>
    <input id="password" type="password" placeholder="Jelszó">

    <button class="btn" onclick="login()">Belépés</button>

    <button class="btn btn-secondary" onclick="window.location.href='user-register.html'">
        Regisztráció
    </button>
</div>

<!-- ❤️ ADOMÁNY GOMB -->
<div id="supportFloatingBtn"
     onclick="window.open('https://www.paypal.com/donate/?hosted_button_id=QGU3WXVSCH22A','_blank')">
    ❤️ Támogasd a SzakiChat-et
</div>

<!-- 🔥 Firebase base config -->
<script type="module" src="firebase-config.js"></script>

<!-- 🔥 LOGIN SCRIPT – szerepkör alapján irányít -->
<script type="module">
    import { auth, db } from "./firebase-config.js";
    import { signInWithEmailAndPassword } 
        from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
    import { doc, getDoc }
        from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

    window.login = async function () {
        const email = document.getElementById("email").value.trim();
        const pass = document.getElementById("password").value;

        if (!email || !pass) {
            alert("Email és jelszó kötelező!");
            return;
        }

        try {
            // Bejelentkezés
            const userCred = await signInWithEmailAndPassword(auth, email, pass);
            const uid = userCred.user.uid;

            // Firestore profil lekérése
            const snap = await getDoc(doc(db, "users", uid));
            if (!snap.exists()) {
                alert("Hiba: a felhasználói profil nem található!");
                return;
            }

            const data = snap.data();
            const role = data.role || "user";

            // 🔥 Szerepkör alapú átirányítás
            if (role === "szaki") {
                window.location.href = "szaki-dashboard.html";
            } else {
                window.location.href = "user-chat-list.html";
            }

        } catch (err) {
            alert("Hiba: " + err.message);
        }
    };
</script>

</body>
</html>
