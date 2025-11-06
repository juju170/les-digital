// les-digital/scripts/main.js
document.addEventListener("DOMContentLoaded", () => {
  const btnMainKuis = document.getElementById("mainKuis");
  const btnBuatSoal = document.getElementById("buatSoal");
  const daftarLomba = document.getElementById("daftarLomba");

  // Contoh role sementara (nanti ambil dari Firebase)
  const userRole = localStorage.getItem("role") || "murid";

  // Tombol akses admin
  if (userRole === "admin") {
    btnBuatSoal.style.display = "inline-block";
  }

  // Navigasi tombol
  btnMainKuis.onclick = () => (window.location.href = "play.html");
  btnBuatSoal.onclick = () => (window.location.href = "create.html");

  // Highlight lomba (dummy dulu)
  daftarLomba.innerHTML = `
    <div class="lomba">
      <h3>Lomba Matematika</h3>
      <p>Berakhir dalam 2 hari</p>
      <button onclick="window.location.href='play.html'">Ikuti Lomba</button>
    </div>
  `;
});
