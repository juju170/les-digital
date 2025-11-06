// les-digital/scripts/auth.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formDaftar");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const kelas = document.getElementById("kelas").value;

    // 🔹 Nanti bagian ini diganti Firebase Auth
    const user = {
      email,
      password,
      kelas,
      role: "murid",
    };

    // Simpan dummy ke localStorage (sementara)
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("role", "murid");

    alert("Pendaftaran berhasil! Selamat datang di Les Simple!");
    window.location.href = "index.html";
  });
});
