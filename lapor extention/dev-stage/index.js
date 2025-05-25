// Import modul fs (file system)
const fs = require('fs');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});


let isDataLoaded = false;
let dataTraining = null;
// Baca file JSON
fs.readFile('datatraining-v2.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Gagal membaca file:', err);
    return;
  }

  try {
    // Parse data JSON ke dalam objek JavaScript
    const jsonData = JSON.parse(data);
    // Tampilkan data ke konsol
    console.log('Data dari file JSON:');
    // console.log(jsonData);
    dataTraining = jsonData;
    isDataLoaded = true;
  } catch (error) {
    console.error('Gagal memparsing data JSON:', error);
  }
});


// Fungsi untuk memisahkan kata-kata dalam teks
function tokenize(text) {
    return text.toLowerCase().split(/\s+/);
}

// Hitung frekuensi kata dalam setiap kelas
function trainNaiveBayes(data) {
    const vocab = new Set(); // Kumpulan kata unik
    const classCounts = {}; // Jumlah dokumen per kelas
    const classWordCounts = {}; // Jumlah kata per kelas
    const classWordFreq = {}; // Frekuensi kata per kelas

    // Inisialisasi struktur data
    for (const { laporan, disposisi } of data) {
        if (!classCounts[disposisi]) {
            classCounts[disposisi] = 0;
            classWordCounts[disposisi] = 0;
            classWordFreq[disposisi] = {};
        }
        classCounts[disposisi] += 1;

        const words = tokenize(laporan);
        for (const word of words) {
            vocab.add(word);
            if (!classWordFreq[disposisi][word]) {
                classWordFreq[disposisi][word] = 0;
            }
            classWordFreq[disposisi][word] += 1;
            classWordCounts[disposisi] += 1;
        }
    }

    return { vocab, classCounts, classWordCounts, classWordFreq };
}

// Fungsi untuk menghitung probabilitas kelas menggunakan Naive Bayes
function predictNaiveBayes(text, vocab, classCounts, classWordCounts, classWordFreq) {
    const words = tokenize(text);
    const classes = Object.keys(classCounts);
    let bestClass = null;
    let bestScore = -Infinity;

    for (const cls of classes) {
        let score = Math.log(classCounts[cls] / dataTraining.length); // Prior probability
        for (const word of words) {
            if (vocab.has(word)) {
                const wordFreq = (classWordFreq[cls][word] || 0) + 1; // Laplace smoothing
                const totalWords = classWordCounts[cls] + vocab.size;
                score += Math.log(wordFreq / totalWords); // Likelihood
            }
        }
        if (score > bestScore) {
            bestScore = score;
            bestClass = cls;
        }
    }

    return bestClass;
}


function boot() {
  let isTrainingReady = setInterval(function () {
    if(isDataLoaded){
      clearInterval(isTrainingReady);
      doJob();
    }
  },500)
}



function doJob() {
    // Training model
  // const { vocab, classCounts, classWordCounts, classWordFreq } = trainNaiveBayes(dataTraining);

  // Contoh prediksi
  const judulSurat1 = "Permohonan dana untuk perbaikan jembatan";
  const judulSurat2 = "Laporan pelaksanaan program kesehatan";
  const judulSurat3 = "Lapor Jalan Desa Rusak Dekat Jalan Provinsi - Jl Masjid Desa Kapas Kec Kapas Kabupaten Bojonegoro";

  // console.log(`Judul Surat: "${judulSurat1}"`);
  // console.log(`Disposisi: ${predictNaiveBayes(judulSurat1, vocab, classCounts, classWordCounts, classWordFreq)}`);

  // console.log(`Judul Surat: "${judulSurat2}"`);
  // console.log(`Disposisi: ${predictNaiveBayes(judulSurat2, vocab, classCounts, classWordCounts, classWordFreq)}`);

  // console.log(`Judul Surat: "${judulSurat3}"`);
  // console.log(`Disposisi: ${predictNaiveBayes(judulSurat3, vocab, classCounts, classWordCounts, classWordFreq)}`);
  // body...


  readline.question('Masukkan Judul Laporan: ', (inputJudul) => {
    if (!inputJudul.trim()) {
      console.log("Judul laporan tidak boleh kosong!");
      readline.close();
      return;
    }

    // Prediksi menggunakan Naive Bayes
    const { vocab, classCounts, classWordCounts, classWordFreq } = trainNaiveBayes(dataTraining);
    const predictions = predictNaiveBayes(inputJudul, vocab, classCounts, classWordCounts, classWordFreq);
    console.log(`Disposisi: ${predictions}`);

    // readline.close();
      doJob();
    
  });
}

// Input dari pengguna via console


boot();
