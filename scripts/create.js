// les-digital/scripts/create.js
document.addEventListener("DOMContentLoaded", () => {
  const tipeSelect = document.getElementById("tipe");
  const formTipeSoal = document.getElementById("formTipeSoal");
  const daftarSoal = document.getElementById("daftarSoal");

  let soalList = JSON.parse(localStorage.getItem("soalList")) || [];

  // --- HELPER: Menampilkan jawaban di daftar soal (FIXED) ---
  const renderJawaban = (soal) => {
    switch (soal.tipe) {
      case "pilihanGanda":
        return `<ul>${soal.pilihan
          .map(
            (p, j) =>
              `<li style="${soal.jawaban === j ? 'color:green; font-weight:bold;' : ''}">
                ${String.fromCharCode(65 + j)}. ${p}
              </li>`
          )
          .join("")}</ul>`;
      case "esai":
        return `<p><strong>Jawaban Benar:</strong> ${soal.jawaban.join(" / ")}</p>`;
      case "pencocokkan":
        return `<ul>${soal.pasangan
          .map((p) => `<li>${p.kiri} ➔ ${p.kanan}</li>`)
          .join("")}</ul>`;
      case "benarSalah":
        return `<p><strong>Jawaban Benar:</strong> ${soal.jawabanBenar}</p>`;
      case "perHuruf":
        return `<p><strong>Jawaban Benar:</strong> ${soal.jawabanBenar}</p>`;
      case "bersilangan":
        return `<p><strong>Jawaban:</strong> ${soal.jawabanMenurun} (Menurun), ${soal.jawabanMendatar} (Mendatar)</p>`;
      case "urutkanKata":
        return `<p><strong>Jawaban Benar:</strong> ${soal.kalimatBenar}</p>`;
      default:
        return "<p><strong>(Tipe soal tidak dikenal)</strong></p>";
    }
  };

  // --- HELPER: Merender daftar soal (FIXED) ---
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
        ${renderJawaban(soal)}
      </div>`
      )
      .join("");
  };

  // --- HELPER: HTML Opsi Lomba (Refactored) ---
  const lombaHtml = `
    <hr style="margin-top: 20px;">
    <label><input type="checkbox" id="isLomba" style="width: auto; margin-right: 10px;"/> Jadikan Soal Lomba</label>
    <div id="lombaOptions" style="display:none; margin-top:8px; padding-left: 20px; border-left: 2px solid #eee;">
      <label>Nama Lencana:</label>
      <input type="text" id="lencana" placeholder="Misal: Juara Cepat" />
      <label>Waktu Mulai:</label>
      <input type="datetime-local" id="mulaiLomba" />
      <label>Waktu Kadaluarsa:</label>
      <input type="datetime-local" id="kadaluarsaLomba" />
    </div>
  `;

  // --- HELPER: Memasang listener ke checkbox lomba (Refactored) ---
  const attachLombaListener = () => {
    const isLomba = document.getElementById("isLomba");
    const lombaOptions = document.getElementById("lombaOptions");
    if (isLomba) {
      isLomba.addEventListener("change", () => {
        lombaOptions.style.display = isLomba.checked ? "block" : "none";
      });
    }
  };

  // --- FUNGSI SIMPAN SOAL TERPUSAT (FIXED) ---
  const simpanSoal = (soal) => {
    // Cek dan tambahkan data lomba
    const isLomba = document.getElementById("isLomba");
    if (isLomba && isLomba.checked) {
      const lencana = document.getElementById("lencana").value.trim();
      const mulai = document.getElementById("mulaiLomba").value;
      const kadaluarsa = document.getElementById("kadaluarsaLomba").value;

      if (!lencana || !mulai || !kadaluarsa) {
        alert("Untuk soal lomba, semua field (lencana, mulai, kadaluarsa) harus diisi!");
        return; // Batalkan penyimpanan
      }

      soal.lomba = {
        aktif: true,
        lencana,
        mulai,
        kadaluarsa,
      };
    } else {
      soal.lomba = { aktif: false };
    }

    soalList.push(soal);
    localStorage.setItem("soalList", JSON.stringify(soalList));
    alert(`Soal ${soal.tipe} berhasil disimpan!`);
    renderSoalList();
    
    // Reset form dengan memanggil render default
    renderFormPilihanGanda();
    tipeSelect.value = "pilihanGanda";
  };

  // ======== PILIHAN GANDA (Refactored) ========
  const renderFormPilihanGanda = () => {
    formTipeSoal.innerHTML = `
      <label>Pertanyaan:</label>
      <textarea id="pertanyaan" placeholder="Masukkan pertanyaan..."></textarea>

      <div id="pilihanWrapper"></div>
      <button type="button" id="tambahPilihan">+ Tambah Pilihan</button>

      <label>Jawaban Benar (pilih salah satu)</label>
      <select id="jawabanBenar"></select>
      
      ${lombaHtml}
      <button type="button" id="saveQuestion" class="simpan-btn-tipe">Simpan Soal Pilihan Ganda</button>
    `;

    const pilihanWrapper = document.getElementById("pilihanWrapper");
    const tambahBtn = document.getElementById("tambahPilihan");
    const jawabanBenar = document.getElementById("jawabanBenar");

    let pilihan = ["", ""];

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
    attachLombaListener(); // Pasang listener lomba

    document.getElementById("saveQuestion").onclick = () => {
      const pertanyaan = document.getElementById("pertanyaan").value.trim();
      const jawaban = parseInt(jawabanBenar.value);

      if (!pertanyaan) return alert("Pertanyaan belum diisi!");
      if (pilihan.some((p) => !p)) return alert("Semua pilihan harus diisi!");

      const soal = {
        tipe: "pilihanGanda",
        pertanyaan,
        pilihan,
        jawaban,
      };
      simpanSoal(soal); // Panggil fungsi simpan terpusat
    };
  };

  // ======== ESAI (KECOCOKKAN) (Refactored) ========
  const renderFormEsai = () => {
    formTipeSoal.innerHTML = `
      <label>Pertanyaan:</label>
      <textarea id="pertanyaan" placeholder="Masukkan pertanyaan..."></textarea>

      <label>Jawaban Benar (pisahkan dengan || jika lebih dari satu)</label>
      <textarea id="jawabanEsai" placeholder="contoh: soekarno || ir soekarno"></textarea>
      
      ${lombaHtml}
      <button type="button" id="saveQuestion" class="simpan-btn-tipe">Simpan Soal Esai</button>
    `;

    attachLombaListener(); // Pasang listener lomba

    document.getElementById("saveQuestion").onclick = () => {
      const pertanyaan = document.getElementById("pertanyaan").value.trim();
      const jawabanInput = document.getElementById("jawabanEsai").value.trim();

      if (!pertanyaan) return alert("Pertanyaan belum diisi!");
      if (!jawabanInput) return alert("Jawaban belum diisi!");

      const jawaban = jawabanInput
        .split("||")
        .map((j) => j.trim().toLowerCase())
        .filter((j) => j);

      if (jawaban.length === 0) return alert("Jawaban valid belum diisi!");

      const soal = {
        tipe: "esai",
        pertanyaan,
        jawaban,
      };
      simpanSoal(soal); // Panggil fungsi simpan terpusat
    };
  };

  // ======== PENCOCOKKAN (Refactored) ========
  const renderFormPencocokkan = () => {
    formTipeSoal.innerHTML = `
      <label>Pertanyaan:</label>
      <input type="text" id="pertanyaan" placeholder="Misal: Cocokkan nama dengan gelar..." />

      <div id="pairList">
        <div class="pair" style="display: flex; gap: 10px;">
          <input type="text" placeholder="Kiri (misal: Soekarno)" class="leftVal" />
          <input type="text" placeholder="Kanan (misal: Ir. Soekarno)" class="rightVal" />
        </div>
      </div>

      <button type="button" id="addPair">+ Tambah Pasangan</button>
      ${lombaHtml}
      <button type="button" id="saveQuestion" class="simpan-btn-tipe">Simpan Soal Pencocokkan</button>
    `;

    const pairList = document.getElementById("pairList");
    const addPair = document.getElementById("addPair");

    addPair.addEventListener("click", () => {
      const div = document.createElement("div");
      div.className = "pair";
      div.style.display = "flex";
      div.style.gap = "10px";
      div.innerHTML = `
        <input type="text" placeholder="Kiri" class="leftVal" />
        <input type="text" placeholder="Kanan" class="rightVal" />
      `;
      pairList.appendChild(div);
    });

    attachLombaListener();

    document.getElementById("saveQuestion").addEventListener("click", () => {
      const pertanyaan = document.getElementById("pertanyaan").value.trim();
      const kiri = [...document.querySelectorAll(".leftVal")].map((el) => el.value.trim());
      const kanan = [...document.querySelectorAll(".rightVal")].map((el) => el.value.trim());

      if (!pertanyaan) return alert("Pertanyaan belum diisi!");
      if (kiri.length < 1) return alert("Minimal ada 1 pasangan!");
      if (kiri.some((k) => !k) || kanan.some((k) => !k)) return alert("Semua pasangan harus diisi!");

      const soal = {
        tipe: "pencocokkan",
        pertanyaan,
        pasangan: kiri.map((k, i) => ({ kiri: k, kanan: kanan[i] })),
      };

      simpanSoal(soal);
    });
  };

  // ======== BENAR SALAH (Refactored) ========
  const renderFormBenarSalah = () => {
    formTipeSoal.innerHTML = `
      <label>Pernyataan:</label>
      <input type="text" id="pertanyaan" placeholder="Misal: Matahari terbit dari barat" />

      <div>
        <label>Pilih jawaban benar:</label>
        <select id="jawabanBenar">
          <option value="Benar">Benar</option>
          <option value="Salah">Salah</option>
        </select>
      </div>

      ${lombaHtml}
      <button type="button" id="saveQuestion" class="simpan-btn-tipe">Simpan Soal Benar/Salah</button>
    `;

    attachLombaListener();

    document.getElementById("saveQuestion").addEventListener("click", () => {
      const pertanyaan = document.getElementById("pertanyaan").value.trim();
      if (!pertanyaan) return alert("Pernyataan belum diisi!");
      
      const soal = {
        tipe: "benarSalah",
        pertanyaan,
        jawabanBenar: document.getElementById("jawabanBenar").value,
      };

      simpanSoal(soal);
    });
  };

  // ======== JAWABAN PER HURUF (Refactored) ========
  const renderFormPerHuruf = () => {
    formTipeSoal.innerHTML = `
      <label>Pertanyaan:</label>
      <input type="text" id="pertanyaan" placeholder="Misal: Sebuah benda untuk membaca..." />

      <label>Jawaban benar (tanpa spasi):</label>
      <input type="text" id="jawabanBenar" placeholder="Misal: BUKU" />

      <label>Huruf pengecoh (tambahan, tanpa spasi):</label>
      <input type="text" id="hurufPengecoh" placeholder="Misal: XYZ" />

      ${lombaHtml}
      <button type="button" id="saveQuestion" class="simpan-btn-tipe">Simpan Soal Per Huruf</button>
    `;

    attachLombaListener();

    document.getElementById("saveQuestion").addEventListener("click", () => {
      const pertanyaan = document.getElementById("pertanyaan").value.trim();
      const jawabanBenar = document.getElementById("jawabanBenar").value.trim().toUpperCase().replace(/\s/g, '');
      const hurufPengecoh = document.getElementById("hurufPengecoh").value.trim().toUpperCase().replace(/\s/g, '');

      if (!pertanyaan) return alert("Pertanyaan belum diisi!");
      if (!jawabanBenar) return alert("Jawaban benar belum diisi!");

      const hurufUnik = [...new Set((jawabanBenar + hurufPengecoh).split(""))];

      const soal = {
        tipe: "perHuruf",
        pertanyaan,
        jawabanBenar,
        hurufPengecoh,
        semuaHuruf: hurufUnik.sort(() => Math.random() - 0.5), // Acak huruf
      };

      simpanSoal(soal);
    });
  };

  // ======== BERSILANGAN (Refactored) ========
  const renderFormBersilangan = () => {
    formTipeSoal.innerHTML = `
      <p>Minimal dua kata, dan harus ada satu huruf yang sama untuk menyilangkan.</p>
      <label>Pertanyaan Menurun:</label>
      <input type="text" id="pertanyaanMenurun" placeholder="Misal: Ibu kota Indonesia" />
      <input type="text" id="jawabanMenurun" placeholder="Misal: JAKARTA" />

      <label>Pertanyaan Mendatar:</label>
      <input type="text" id="pertanyaanMendatar" placeholder="Misal: Nama pulau terbesar di Indonesia" />
      <input type="text" id="jawabanMendatar" placeholder="Misal: KALIMANTAN" />

      ${lombaHtml}
      <button type="button" id="saveQuestion" class="simpan-btn-tipe">Simpan Soal Bersilangan</button>
    `;

    attachLombaListener();

    document.getElementById("saveQuestion").addEventListener("click", () => {
      const pertanyaanMenurun = document.getElementById("pertanyaanMenurun").value.trim();
      const jawabanMenurun = document.getElementById("jawabanMenurun").value.trim().toUpperCase().replace(/\s/g, '');
      const pertanyaanMendatar = document.getElementById("pertanyaanMendatar").value.trim();
      const jawabanMendatar = document.getElementById("jawabanMendatar").value.trim().toUpperCase().replace(/\s/g, '');

      if (!pertanyaanMenurun || !jawabanMenurun || !pertanyaanMendatar || !jawabanMendatar) {
        return alert("Semua field harus diisi!");
      }

      const hurufSama = [...jawabanMenurun].find((h) => jawabanMendatar.includes(h));

      if (!hurufSama) {
        alert("Harus ada minimal satu huruf yang sama antara jawaban menurun dan mendatar!");
        return;
      }

      const soal = {
        tipe: "bersilangan",
        pertanyaanMenurun,
        jawabanMenurun,
        pertanyaanMendatar,
        jawabanMendatar,
        hurufSilang: hurufSama,
      };

      simpanSoal(soal);
    });
  };

  // ======== URUTKAN KATA (Refactored) ========
  const renderFormUrutkanKata = () => {
    formTipeSoal.innerHTML = `
      <label>Pertanyaan:</label>
      <input type="text" id="pertanyaan" placeholder="Misal: Susunlah kata berikut menjadi kalimat yang benar" />

      <label>Kalimat benar:</label>
      <input type="text" id="kalimatBenar" placeholder="Misal: Saya suka makan nasi goreng" />

      ${lombaHtml}
      <button type="button" id="saveQuestion" class="simpan-btn-tipe">Simpan Soal Urutkan Kata</button>
    `;

    attachLombaListener();

    document.getElementById("saveQuestion").addEventListener("click", () => {
      const pertanyaan = document.getElementById("pertanyaan").value.trim();
      const kalimatBenar = document.getElementById("kalimatBenar").value.trim();

      if (!pertanyaan) return alert("Pertanyaan belum diisi!");
      if (!kalimatBenar) return alert("Kalimat benar belum diisi!");

      if (!kalimatBenar.includes(" ")) {
        alert("Kalimat harus terdiri dari beberapa kata agar bisa diacak!");
        return;
      }

      const kataArray = kalimatBenar.split(" ");
      const kataAcak = [...kataArray].sort(() => Math.random() - 0.5);

      const soal = {
        tipe: "urutkanKata",
        pertanyaan,
        kalimatBenar,
        kataAcak,
      };

      simpanSoal(soal);
    });
  };

  // ======== EVENT PILIHAN TIPE SOAL (FIXED) ========
  tipeSelect.addEventListener("change", (e) => {
    const tipe = e.target.value;
    if (tipe === "pilihanGanda") renderFormPilihanGanda();
    else if (tipe === "esai") renderFormEsai();
    else if (tipe === "pencocokkan") renderFormPencocokkan();
    else if (tipe === "benarSalah") renderFormBenarSalah();
    else if (tipe === "perHuruf") renderFormPerHuruf();
    else if (tipe === "bersilangan") renderFormBersilangan();
    else if (tipe === "urutkanKata") renderFormUrutkanKata();
  });

  // Default pertama kali dimuat
  renderFormPilihanGanda();
  renderSoalList();
});

