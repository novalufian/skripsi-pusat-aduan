// URL endpoint untuk mendapatkan data training
const apiUrl = "https://skripsi-pusat-aduan.vercel.app/api/aduan";
let dataTraining = null;

// Eksekusi utama untuk memuat data training
fetch(apiUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    dataTraining = data;
    console.log("Data loaded successfully", data);
    initializeExtension();
  })
  .catch(error => {
    console.error("Error loading JSON:", error);
    // Fallback atau retry logic bisa ditambahkan di sini
  });

/**
 * INISIALISASI EKSTENSI
 * Fungsi utama untuk memulai semua komponen ekstensi
 */
function initializeExtension() {
  injectStyle(); // Menyisipkan CSS
  waitAndSetObserver(); // Setup observer untuk perubahan DOM
  console.log("Content script initialized with data");
}

// ======================== FUNGSI BANTU ======================== //

/**
 * MENYISIPKAN TOMBOL PROSES
 * @param {HTMLElement} PARENT_TARGET - Elemen parent tempat tombol akan disisipkan
 * @param {string} ID_TARGET - ID unik untuk elemen terkait
 */
function injectButton(PARENT_TARGET, ID_TARGET) {
  if (PARENT_TARGET.querySelector('button[data-id]')) return;
  
  const imageUrl = chrome.runtime.getURL("process.png");
  const btn = document.createElement("button");
  const img = document.createElement("img");
  const p = document.createElement("p");

  img.src = imageUrl;
  img.alt = "Process";
  btn.appendChild(img);
  btn.setAttribute("data-id", ID_TARGET);
  btn.classList.add("btn-success");
  btn.addEventListener("click", doActionProcess);

  p.classList.add("output-" + ID_TARGET, "text-danger");

  PARENT_TARGET.appendChild(btn);
  PARENT_TARGET.parentElement.appendChild(p);
  PARENT_TARGET.classList.add("target-parent");
}

/**
 * MENYISIPKAN STYLE CSS
 * Menambahkan CSS kustom untuk tampilan tombol dan hasil
 */
function injectStyle() {
  const style = document.createElement("style");
  style.textContent = `
    .target-parent button img {
      height: 30px;
    }
    .target-parent {
      display: flex;
    }
    .target-parent button {
      margin-left: 10px;
      border-radius: 100px 100px 0px 100px;
    }
    .text-danger {
      color: #dc3545;
      margin-top: 5px;
    }
  `;
  document.querySelector("body").appendChild(style);
}

/**
 * GENERATE UNIQUE ID
 * Membuat ID unik untuk elemen DOM
 */
function generateUniqueID() {
  return "el_" + Math.random().toString(36).substring(2, 8) + Date.now().toString(36);
}

/**
 * HANDLER TOMBOL PROSES
 * @param {Event} e - Event object dari klik tombol
 */
function doActionProcess(e) {
  try {
    e.preventDefault();
    const id = this.getAttribute("data-id");
    if (!id) return;
    
    const targetInput = document.querySelector(`.${id}`);
    if (!targetInput?.value || !dataTraining) {
      console.log("Waiting for data...");
      setTimeout(() => this.click(), 300); // Coba lagi setelah delay
      return;
    }
    
    const model = trainNaiveBayes(dataTraining);
    const { prediction, topProbabilities } = predictDisposisi(model, targetInput.value, "");
    
    const targetOutput = document.querySelector(".output-" + id);
    if (targetOutput) {
      // Format tampilan untuk 3 probabilitas teratas
      const top3Display = topProbabilities
        .map(item => `<li> <strong>${item.percentage}% </strong>: ${item.disposisi}  </li>`)
        .join('');
      
      targetOutput.innerHTML = `Disposisi: <strong>${prediction}</strong> <br/> <br/> <ul>${top3Display}</ul>`;
      console.log("Final prediction display:", targetOutput.textContent);
    }
  } catch (error) {
    console.error("Process error:", error);
  }
}

// ======================== IMPLEMENTASI NAIVE BAYES ======================== //

/**
 * PREPROCESSING TEXT
 * Membersihkan dan mempersiapkan teks untuk analisis
 * @param {string} text - Teks input
 * @returns {Array} Array kata yang sudah diproses
 */
function preprocessText(text) {
  if (!text) return [];
  return text
    .toLowerCase() // Konversi ke huruf kecil
    .replace(/[^a-z0-9\s]/g, "") // Hapus karakter khusus
    .split(/\s+/) // Pecah menjadi array kata
    .filter(word => word.length > 0); // Hapus string kosong
}

/**
 * TRAINING NAIVE BAYES
 * Membangun model dari data training
 * @param {Array} data - Data training
 * @returns {Object} Model Naive Bayes
 */
function trainNaiveBayes(data) {
  if (!data || !Array.isArray(data)) {
    throw new Error("Invalid training data");
  }

  // Vocabulary: Menyimpan semua kata unik
  const vocabulary = new Set();
  
  // classCounts: Menghitung dokumen per kelas
  const classCounts = {};
  
  // wordCounts: Menghitung frekuensi kata per kelas
  const wordCounts = {};

  // Inisialisasi struktur data untuk setiap kelas
  data.forEach(item => {
    const disposisi = item.disposisi;
    if (!classCounts[disposisi]) {
      classCounts[disposisi] = 0;
      wordCounts[disposisi] = {};
    }
  });

  // Proses training setiap dokumen
  data.forEach(item => {
    const disposisi = item.disposisi;
    const combinedText = `${item.judul || ""} ${item.laporan || ""}`;
    const tokens = preprocessText(combinedText);

    classCounts[disposisi]++; // Tambah count dokumen
    
    // Hitung frekuensi kata
    tokens.forEach(word => {
      vocabulary.add(word); // Tambah ke vocabulary
      wordCounts[disposisi][word] = (wordCounts[disposisi][word] || 0) + 1;
    });
  });

  return { vocabulary, classCounts, wordCounts };
}

/**
 * PREDIKSI DISPOSISI
 * Memprediksi kelas dengan probabilitas tertinggi
 * @param {Object} model - Model yang sudah dilatih
 * @param {string} judul - Judul aduan
 * @param {string} laporan - Isi laporan
 * @returns {Object} Prediksi dan probabilitas
 */
function predictDisposisi(model, judul, laporan) {
  if (!model || !judul) return null;

  const { vocabulary, classCounts, wordCounts } = model;
  const totalDocuments = Object.values(classCounts).reduce((sum, count) => sum + count, 0);
  const tokens = preprocessText(`${judul} ${laporan}`);

  // Hitung log probabilitas untuk setiap kelas
  const probabilities = {};
  for (const disposisi in classCounts) {
    // Prior probability P(disposisi)
    const prior = classCounts[disposisi] / totalDocuments;
    let likelihood = Math.log(prior); // Gunakan log untuk stabilitas numerik

    // Hitung likelihood P(kata|disposisi)
    tokens.forEach(word => {
      const wordCount = wordCounts[disposisi][word] || 0;
      // Laplace smoothing untuk hindari probabilitas 0
      const wordProbability = (wordCount + 1) / 
        (Object.keys(wordCounts[disposisi]).length + vocabulary.size);
      likelihood += Math.log(wordProbability);
    });

    probabilities[disposisi] = likelihood;
  }

  // Ambil 3 probabilitas tertinggi
  const results = getTopProbabilities(probabilities, 3);
  console.log("Top 3 prediction probabilities:", results);

  return {
    prediction: results[0].disposisi, // Prediksi teratas
    topProbabilities: results // 3 besar probabilitas
  };
}

/**
 * KONVERSI KE PROBABILITAS NORMAL
 * @param {Object} logProbabilities - Probabilitas dalam log
 * @param {number} topN - Jumlah hasil teratas
 * @returns {Array} Probabilitas terurut
 */
function getTopProbabilities(logProbabilities, topN = 3) {
  // Konversi dari log probabilitas ke skala normal
  const maxLog = Math.max(...Object.values(logProbabilities));
  const scaledProbs = {};
  
  // Hilangkan efek overflow
  for (const [key, value] of Object.entries(logProbabilities)) {
    scaledProbs[key] = Math.exp(value - maxLog);
  }

  // Normalisasi ke persentase
  const sum = Object.values(scaledProbs).reduce((a, b) => a + b, 0);
  const percentages = [];
  
  // Hitung persentase tiap kelas
  for (const [disposisi, value] of Object.entries(scaledProbs)) {
    percentages.push({
      disposisi,
      percentage: (value / sum * 100).toFixed(2) // 2 digit desimal
    });
  }

  // Urutkan dan ambil topN
  return percentages.sort((a, b) => b.percentage - a.percentage).slice(0, topN);
}

// ======================== OBSERVER UNTUK PERUBAHAN DOM ======================== //

/**
 * MENUNGGU DAN SETUP OBSERVER
 * Menunggu elemen target siap kemudian setup observer
 */
function waitAndSetObserver() {
  const targetNode = document.querySelector(".content-body");
  if (targetNode) {
    setupObserver(targetNode);
  } else {
    setTimeout(waitAndSetObserver, 500); // Coba lagi setelah 500ms
  }
}

/**
 * SETUP MUTATION OBSERVER
 * @param {HTMLElement} targetNode - Elemen yang akan di-observe
 */
function setupObserver(targetNode) {
  const observer = new MutationObserver((mutations, obs) => {
    // Hanya proses jika data sudah dimuat dan ada perubahan
    if (!dataTraining || mutations.length === 0) return;
    
    // Cari elemen yang belum diproses
    const loadedcontent = document.querySelectorAll(".loadedcontent:not(.injected), .block-comments-thread:not(.injected)");
    
    loadedcontent.forEach(el => {
      const id = generateUniqueID();
      const INPUT_JUDUL = el.querySelector(".form-control");
      
      // Cari label "Disposisi ke"
      el.querySelectorAll('label').forEach(label => {
        if(label.textContent.trim() === 'Disposisi ke') {
          const ELEMENT_TARGET = label.parentElement.querySelector(".selectize-control");
          
          // Jika target ditemukan dan tombol belum ada
          if (ELEMENT_TARGET && !ELEMENT_TARGET.querySelector('button[data-id]')) {
            el.classList.add("injected"); // Tandai sudah diproses
            INPUT_JUDUL?.classList.add(id); // Tambahkan ID ke input
            injectButton(ELEMENT_TARGET, id); // Sisipkan tombol
          }
        }
      });
    });
  });

  // Mulai mengamati perubahan
  observer.observe(targetNode, {
    childList: true,  // Observasi penambahan anak elemen
    subtree: true,    // Observasi seluruh subtree
    attributes: false,
    characterData: false
  });
}