// les-digital/scripts/create.js
document.addEventListener("DOMContentLoaded", () => {
  const tipeSelect = document.getElementById("tipe");
  const formTipeSoal = document.getElementById("formTipeSoal");
  const simpanBtn = document.getElementById("simpanSoal");
  const daftarSoal = document.getElementById("daftarSoal");

  let soalList = JSON.parse(localStorage.getItem("soalList")) || [];

  const renderSoalList = () => {
    if (soalList.length === 0) {
      daftarSoal.innerHTML = "<p>Belum ada soal tersimpan.</p>";
      return;
    }

    daftarSoal.innerHTML = soalList
      .map(
        (soal, i) => `
      <div class="soal-item">
        <h3>${i + 1}. (${soal.tipe}) ${soal.pertanyaan}</h3>
        ${
          soal.tipe === "pilihanGanda"
            ? `<ul>${soal.pilihan
                .map(
                  (p, j) =>
                    `<li${soal.jawaban === j ? ' style="color:green;"' : ""}>
                      ${String.fromCharCode(65 + j)}. ${p}
                    </li>`
                )
                .join("")}</ul>`
            : `<p><strong>Jawaban Benar:</strong> ${soal.jawaban.join(
                ", "
              )}</p>`
        }
      </div>`
      )
      .join("");
  };

  // ======== PILIHAN GANDA ========
  const renderFormPilihanGanda = () => {
    formTipeSoal.innerHTML = `
      <label>Pertanyaan:</label>
      <textarea id="pertanyaan" placeholder="Masukkan pertanyaan..."></textarea>

      <div id="pilihanWrapper"></div>
      <button type="button" id="tambahPilihan">+ Tambah Pilihan</button>

      <label>Jawaban Benar (pilih salah satu)</label>
      <select id="jawabanBenar"></select>
    `;

    const pilihanWrapper = document.getElementById("pilihanWrapper");
    const tambahBtn = document.getElementById("tambahPilihan");
    const jawabanBenar = document.getElementById("jawabanBenar");

    let pilihan = ["", ""]; // awal minimal 2

    const updatePilihanUI = () => {
      pilihanWrapper.innerHTML = "";
      pilihan.forEach((teks, i) => {
        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = `Pilihan ${i + 1}`;
        input.value = teks;
        input.oninput = () => (pilihan[i] = input.value);
        pilihanWrapper.appendChild(input);
      });

      jawabanBenar.innerHTML = pilihan
        .map((_, i) => `<option value="${i}">${String.fromCharCode(65 + i)}</option>`)
        .join("");
    };

    tambahBtn.onclick = () => {
      if (pilihan.length < 4) {
        pilihan.push("");
        updatePilihanUI();
      } else {
        alert("Maksimal 4 pilihan!");
      }
    };

    updatePilihanUI();

    simpanBtn.onclick = () => {
      const pertanyaan = document.getElementById("pertanyaan").value.trim();
      const jawaban = parseInt(jawabanBenar.value);

      if (!pertanyaan) return alert("Pertanyaan belum diisi!");
      if (pilihan.some((p) => !p)) return alert("Semua pilihan harus diisi!");

      soalList.push({
        tipe: "pilihanGanda",
        pertanyaan,
        pilihan,
        jawaban,
      });

      localStorage.setItem("soalList", JSON.stringify(soalList));
      alert("Soal pilihan ganda berhasil disimpan!");
      renderSoalList();
    };
  };

  // ======== ESAI (KECOCOKKAN) ========
  const renderFormEsai = () => {
    formTipeSoal.innerHTML = `
      <label>Pertanyaan:</label>
      <textarea id="pertanyaan" placeholder="Masukkan pertanyaan..."></textarea>

      <label>Jawaban Benar (pisahkan dengan || jika lebih dari satu)</label>
      <textarea id="jawabanEsai" placeholder="contoh: soekarno || ir soekarno"></textarea>
    `;

    simpanBtn.onclick = () => {
      const pertanyaan = document.getElementById("pertanyaan").value.trim();
      const jawabanInput = document.getElementById("jawabanEsai").value.trim();

      if (!pertanyaan) return alert("Pertanyaan belum diisi!");
      if (!jawabanInput) return alert("Jawaban belum diisi!");

      const jawaban = jawabanInput
        .split("||")
        .map((j) => j.trim().toLowerCase())
        .filter((j) => j);

      soalList.push({
        tipe: "esai",
        pertanyaan,
        jawaban,
      });

      localStorage.setItem("soalList", JSON.stringify(soalList));
      alert("Soal esai berhasil disimpan!");
      renderSoalList();
    };
  };

  // ======== EVENT PILIHAN TIPE SOAL ========
  tipeSelect.addEventListener("change", (e) => {
    const tipe = e.target.value;
    if (tipe === "pilihanGanda") renderFormPilihanGanda();
    else if (tipe === "esai") renderFormEsai();
  });

  // ====== TIPE SOAL PENC0C0KKAN ======
else if (tipe === "pencocokkan") {
  const wadah = document.getElementById("formWadah");
  wadah.innerHTML = `
    <label>Pertanyaan:</label>
    <input type="text" id="pertanyaan" placeholder="Misal: Cocokkan nama dengan gelar..." />

    <div id="pairList">
      <div class="pair">
        <input type="text" placeholder="Kiri (misal: Soekarno)" class="leftVal" />
        <input type="text" placeholder="Kanan (misal: Ir. Soekarno)" class="rightVal" />
      </div>
    </div>

    <button id="addPair">+ Tambah Pasangan</button>
    <button id="saveQuestion">Simpan Soal</button>
  `;

  const pairList = document.getElementById("pairList");
  const addPair = document.getElementById("addPair");

  addPair.addEventListener("click", () => {
    const div = document.createElement("div");
    div.className = "pair";
    div.innerHTML = `
      <input type="text" placeholder="Kiri (misal: Soekarno)" class="leftVal" />
      <input type="text" placeholder="Kanan (misal: Ir. Soekarno)" class="rightVal" />
    `;
    pairList.appendChild(div);
  });

  document.getElementById("saveQuestion").addEventListener("click", () => {
    const pertanyaan = document.getElementById("pertanyaan").value;
    const kiri = [...document.querySelectorAll(".leftVal")].map((el) => el.value);
    const kanan = [...document.querySelectorAll(".rightVal")].map((el) => el.value);

    const soal = {
      tipe,
      pertanyaan,
      pasangan: kiri.map((k, i) => ({ kiri: k, kanan: kanan[i] })),
    };

    simpanSoal(soal);
  });
}

  // ====== TIPE SOAL BENAR / SALAH ======
else if (tipe === "benarSalah") {
  const wadah = document.getElementById("formWadah");
  wadah.innerHTML = `
    <label>Pernyataan:</label>
    <input type="text" id="pertanyaan" placeholder="Misal: Matahari terbit dari barat" />

    <div>
      <label>Pilih jawaban benar:</label>
      <select id="jawabanBenar">
        <option value="Benar">Benar</option>
        <option value="Salah">Salah</option>
      </select>
    </div>

    <button id="saveQuestion">Simpan Soal</button>
  `;

  document.getElementById("saveQuestion").addEventListener("click", () => {
    const pertanyaan = document.getElementById("pertanyaan").value;
    const jawabanBenar = document.getElementById("jawabanBenar").value;

    const soal = {
      tipe,
      pertanyaan,
      jawabanBenar,
    };

    simpanSoal(soal);
  });
}

  // ====== TIPE SOAL JAWABAN PER HURUF ======
else if (tipe === "perHuruf") {
  const wadah = document.getElementById("formWadah");
  wadah.innerHTML = `
    <label>Pertanyaan:</label>
    <input type="text" id="pertanyaan" placeholder="Misal: Sebuah benda untuk membaca..." />

    <label>Jawaban benar (tanpa spasi):</label>
    <input type="text" id="jawabanBenar" placeholder="Misal: BUKU" />

    <label>Huruf pengecoh (tambahan):</label>
    <input type="text" id="hurufPengecoh" placeholder="Misal: XYZ" />

    <button id="saveQuestion">Simpan Soal</button>
  `;

  document.getElementById("saveQuestion").addEventListener("click", () => {
    const pertanyaan = document.getElementById("pertanyaan").value.trim();
    const jawabanBenar = document.getElementById("jawabanBenar").value.trim().toUpperCase();
    const hurufPengecoh = document.getElementById("hurufPengecoh").value.trim().toUpperCase();

    // Gabungkan semua huruf unik untuk nanti dijadikan tombol
    const hurufUnik = [...new Set((jawabanBenar + hurufPengecoh).split(""))];

    const soal = {
      tipe,
      pertanyaan,
      jawabanBenar,
      hurufPengecoh,
      semuaHuruf: hurufUnik,
    };

    simpanSoal(soal);
  });
}

  // ====== TIPE SOAL BERSILANGAN (MENURUN & MENDATAR) ======
else if (tipe === "bersilangan") {
  const wadah = document.getElementById("formWadah");
  wadah.innerHTML = `
    <p>Minimal dua kata, dan harus ada satu huruf yang sama untuk menyilangkan.</p>
    <label>Pertanyaan Menurun:</label>
    <input type="text" id="pertanyaanMenurun" placeholder="Misal: Ibu kota Indonesia" />
    <input type="text" id="jawabanMenurun" placeholder="Misal: JAKARTA" />

    <label>Pertanyaan Mendatar:</label>
    <input type="text" id="pertanyaanMendatar" placeholder="Misal: Nama pulau terbesar di Indonesia" />
    <input type="text" id="jawabanMendatar" placeholder="Misal: KALIMANTAN" />

    <button id="saveQuestion">Simpan Soal</button>
  `;

  document.getElementById("saveQuestion").addEventListener("click", () => {
    const pertanyaanMenurun = document.getElementById("pertanyaanMenurun").value.trim();
    const jawabanMenurun = document.getElementById("jawabanMenurun").value.trim().toUpperCase();
    const pertanyaanMendatar = document.getElementById("pertanyaanMendatar").value.trim();
    const jawabanMendatar = document.getElementById("jawabanMendatar").value.trim().toUpperCase();

    // Cek apakah ada huruf yang sama untuk disilangkan
    const hurufSama = [...jawabanMenurun].find((h) => jawabanMendatar.includes(h));

    if (!hurufSama) {
      alert("Harus ada minimal satu huruf yang sama antara jawaban menurun dan mendatar!");
      return;
    }

    const soal = {
      tipe,
      pertanyaanMenurun,
      jawabanMenurun,
      pertanyaanMendatar,
      jawabanMendatar,
      hurufSilang: hurufSama,
    };

    simpanSoal(soal);
  });
}

  // Default pertama
  renderFormPilihanGanda();
  renderSoalList();
});
