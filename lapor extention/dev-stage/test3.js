// Import modul fs (file system)
const fs = require('fs');


let isDataLoaded = false;
let trainingData = null;
// Baca file JSON
fs.readFile('datatraining.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Gagal membaca file:', err);
    return;
  }

  try {
    // Parse data JSON ke dalam objek JavaScript
    const jsonData = JSON.parse(data);
    // Tampilkan data ke konsol
    console.log('Data dari file JSON:');
    trainingData = jsonData;
    isDataLoaded = true;
  } catch (error) {
    console.error('Gagal memparsing data JSON:', error);
  }
});

// Fungsi untuk menghitung probabilitas Naive Bayes
function naiveBayesClassifier(inputJudul) {
  const words = inputJudul.toLowerCase().split(" "); // Tokenisasi judul menjadi kata-kata
  const disposisiCounts = {}; // Menyimpan jumlah kemunculan setiap disposisi
  const wordCounts = {}; // Menyimpan jumlah kemunculan kata per disposisi

  // Menghitung frekuensi disposisi dan kata-kata dalam data training
  trainingData.forEach(({ judul, disposisi }) => {
    if (!disposisiCounts[disposisi]) {
      disposisiCounts[disposisi] = 0;
      wordCounts[disposisi] = {};
    }
    disposisiCounts[disposisi]++;

    const titleWords = judul.toLowerCase().split(" ");
    titleWords.forEach((word) => {
      if (!wordCounts[disposisi][word]) {
        wordCounts[disposisi][word] = 0;
      }
      wordCounts[disposisi][word]++;
    });
  });

  // Menghitung probabilitas untuk setiap disposisi
  const probabilities = {};
  for (const disposisi in disposisiCounts) {
    let prob = disposisiCounts[disposisi] / trainingData.length; // Prior probability
    words.forEach((word) => {
      if (wordCounts[disposisi][word]) {
        prob *= (wordCounts[disposisi][word] + 1) / (disposisiCounts[disposisi] + Object.keys(wordCounts[disposisi]).length); // Likelihood dengan smoothing
      } else {
        prob *= 1 / (disposisiCounts[disposisi] + Object.keys(wordCounts[disposisi]).length); // Smoothing jika kata tidak ditemukan
      }
    });
    probabilities[disposisi] = prob;
  }

  // Mengurutkan hasil berdasarkan probabilitas tertinggi
  const sortedResults = Object.entries(probabilities).sort((a, b) => b[1] - a[1]);
  return sortedResults.slice(0, 2).map(([disposisi]) => disposisi); // Mengambil 2 saran teratas
}

// Fungsi untuk menampilkan hasil prediksi
function predict() {
  const inputJudul = "Lapor Jalan Desa Rusak Dekat Jalan Provinsi - Jl Masjid Desa Kapas Kec Kapas Kabupaten Bojonegoro"
  if (!inputJudul) {
    alert("Masukkan judul laporan terlebih dahulu!");
    return;
  }

  const predictions = naiveBayesClassifier(inputJudul);
  console.log(`Saran disposisi Tujuan:<br>1. ${predictions[0]}<br>2. ${predictions[1]}`) ;
}

function boot() {
  let isTrainingReady = setInterval(function () {
    if(isDataLoaded){
      clearInterval(isTrainingReady);
      predict();
    }
  },500)
}

boot();