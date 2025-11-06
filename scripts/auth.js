// les-digital/scripts/auth.js
document.addEventListener("DOMContentLoaded", () => {
  const formDaftar = document.getElementById("formDaftar");
  const formLogin = document.getElementById("formLogin");

  // ====== FORM DAFTAR ======
  if (formDaftar) {
    formDaftar.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();
      const kelas = document.getElementById("kelas").value;

      const user = { email, password, kelas, role: "murid" };
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", "murid");

      alert("Pendaftaran berhasil! Selamat datang di Les Simple!");
      window.location.href = "index.html";
    });
  }

  // ====== FORM LOGIN (ADMIN) ======
  if (formLogin) {
    formLogin.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      // 🔹 Dummy login admin
      const adminEmail = "admin@lessimple.com";
      const adminPass = "123456";

      if (email === adminEmail && password === adminPass) {
        localStorage.setItem("role", "admin");
        localStorage.setItem(
          "user",
          JSON.stringify({ email, role: "admin" })
        );
        alert("Login berhasil sebagai Admin!");
        window.location.href = "index.html";
      } else {
        alert("Email atau password salah!");
      }
    });
  }
});
