window.registerUser = async function () {
  const name = document.getElementById("name").value.trim();
  const job = document.getElementById("profession").value.trim();
  const city = document.getElementById("city").value.trim();
  const email = document.getElementById("email").value.trim();
  const pass1 = document.getElementById("pass1").value;
  const pass2 = document.getElementById("pass2").value;
  const phone = document.getElementById("phone").value.trim();

  if (!name || !job || !city || !email || !pass1 || !pass2 || !phone) {
    alert("Minden mező kötelező!");
    return;
  }

  if (pass1 !== pass2) {
    alert("A két jelszó nem egyezik!");
    return;
  }

  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, pass1);
    const uid = userCred.user.uid;

    await setDoc(doc(db, "users", uid), {
      role: "user",
      name,
      profession: job,
      city,
      phone,
      shareCount: 0,
      online: false
    });

    alert("Sikeres regisztráció!");
    window.location.href = "user-chat-list.html";

  } catch (err) {
    alert("Hiba történt: " + err.message);
  }
};
