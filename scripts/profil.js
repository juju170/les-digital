// les-digital/scripts/profile.js
document.addEventListener("DOMContentLoaded", () => {
  const userData = JSON.parse(localStorage.getItem("user"));
  const role = localStorage.getItem("role");

  const muridProfile = document.getElementById("muridProfile");
  const adminPanel = document.getElementById("adminPanel");
  const logoutBtn = document.getElementById("logoutBtn");

  if (!userData) {
    alert("Silakan login terlebih dahulu!");
    window.location.href = "login.html";
    return;
  }

  // ====== MODE MURID ======
  if (role === "murid") {
    muridProfile.style.display = "block";
    document.getElementById("muridEmail").textContent = userData.email;
    document.getElementById("muridKelas").textContent = userData.kelas;
    document.getElementById("muridPoin").textContent = userData.poin || 0;

    const lencanaList = document.getElementById("muridLencana");
    const lencana = userData.lencana || [];
    lencanaList.innerHTML =
      lencana.length > 0
        ? lencana.map((l) => `<li>${l}</li>`).join("")
        : "<li>Belum ada lencana</li>";
  }

  // ====== MODE ADMIN ======
  if (role === "admin") {
    adminPanel.style.display = "block";

    // Dummy daftar murid (nanti ambil dari Firestore)
    const muridData = JSON.parse(localStorage.getItem("daftarMurid")) || [
      { email: "murid1@mail.com", kelas: "PAUD" },
      { email: "murid2@mail.com", kelas: "Kelas 1" },
    ];

    const daftarDiv = document.getElementById("daftarMurid");
    daftarDiv.innerHTML = muridData
      .map(
        (m, i) => `
        <div class="murid-item">
          <p><strong>${m.email}</strong> - ${m.kelas}</p>
          <select id="kelas-${i}">
            <option ${m.kelas === "PAUD" ? "selected" : ""}>PAUD</option>
            <option ${m.kelas === "Kelas 1" ? "selected" : ""}>Kelas 1</option>
            <option ${m.kelas === "Kelas 2" ? "selected" : ""}>Kelas 2</option>
          </select>
          <button onclick="updateKelas(${i})">Ubah</button>
        </div>
      `
      )
      .join("");
  }

  // ====== Tombol logout ======
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    alert("Berhasil keluar!");
    window.location.href = "index.html";
  });
});

// Fungsi ubah kelas (untuk admin)
function updateKelas(index) {
  const muridData = JSON.parse(localStorage.getItem("daftarMurid")) || [];
  const newKelas = document.getElementById(`kelas-${index}`).value;
  muridData[index].kelas = newKelas;
  localStorage.setItem("daftarMurid", JSON.stringify(muridData));
  alert(`Kelas ${muridData[index].email} diubah ke ${newKelas}`);
}
