-- Tabel PengajuanMutasi
CREATE TABLE PengajuanMutasi (
    id_mutasi INT PRIMARY KEY AUTO_INCREMENT,
    id_pegawai INT NOT NULL, -- Referensi ke tabel Pegawai
    instansi_tujuan VARCHAR(255) NOT NULL, -- Nama instansi tujuan
    tanggal_pengajuan DATE NOT NULL,
    keterangan TEXT, -- Alasan atau catatan tambahan
    status ENUM('Diajukan', 'Disetujui', 'Ditolak', 'Direvisi') DEFAULT 'Diajukan',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT, -- ID pengguna yang membuat pengajuan (misalnya pegawai)
    updated_by INT, -- ID pengguna yang terakhir memperbarui pengajuan
    is_deleted BOOLEAN DEFAULT FALSE, -- Soft delete flag
    FOREIGN KEY (id_pegawai) REFERENCES Pegawai(id_pegawai)
);

-- Tabel DokumenMutasi
CREATE TABLE DokumenMutasi (
    id_dokumen INT PRIMARY KEY AUTO_INCREMENT,
    id_mutasi INT NOT NULL, -- Referensi ke tabel PengajuanMutasi
    jenis_dokumen ENUM('Permohonan Pribadi', 'SK Terakhir', 'Rekomendasi Instansi Tujuan') NOT NULL,
    file_path TEXT NOT NULL, -- Path atau URL file dokumen
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT, -- ID pengguna yang mengunggah dokumen
    updated_by INT, -- ID pengguna yang terakhir memperbarui dokumen
    is_deleted BOOLEAN DEFAULT FALSE, -- Soft delete flag
    FOREIGN KEY (id_mutasi) REFERENCES PengajuanMutasi(id_mutasi)
);

-- Tabel PersetujuanMutasi
CREATE TABLE PersetujuanMutasi (
    id_persetujuan INT PRIMARY KEY AUTO_INCREMENT,
    id_mutasi INT NOT NULL, -- Referensi ke tabel PengajuanMutasi
    id_penyetuju INT NOT NULL, -- Referensi ke tabel Pegawai (penyetuju: Kepala Ruangan, Kepala Bidang, dll.)
    tingkat ENUM('Kepala Ruangan', 'Kepala Bidang', 'Kepegawaian', 'Direktur/KTU') NOT NULL,
    status ENUM('Disetujui', 'Ditolak', 'Direvisi') NOT NULL,
    catatan TEXT, -- Catatan dari penyetuju
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT, -- ID pengguna yang membuat persetujuan
    updated_by INT, -- ID pengguna yang terakhir memperbarui persetujuan
    is_deleted BOOLEAN DEFAULT FALSE, -- Soft delete flag
    FOREIGN KEY (id_mutasi) REFERENCES PengajuanMutasi(id_mutasi),
    FOREIGN KEY (id_penyetuju) REFERENCES Pegawai(id_pegawai)
);

-- Tabel RekomendasiMutasi
CREATE TABLE RekomendasiMutasi (
    id_rekomendasi INT PRIMARY KEY AUTO_INCREMENT,
    id_mutasi INT NOT NULL, -- Referensi ke tabel PengajuanMutasi
    nomor_rekomendasi VARCHAR(100) NOT NULL, -- Nomor rekomendasi resmi
    tanggal_rekomendasi DATE NOT NULL, -- Tanggal penerbitan rekomendasi
    file_path TEXT NOT NULL, -- Path atau URL file rekomendasi
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT, -- ID pengguna yang membuat rekomendasi
    updated_by INT, -- ID pengguna yang terakhir memperbarui rekomendasi
    is_deleted BOOLEAN DEFAULT FALSE, -- Soft delete flag
    FOREIGN KEY (id_mutasi) REFERENCES PengajuanMutasi(id_mutasi)
);

-- Tabel AuditLogMutasi
CREATE TABLE AuditLogMutasi (
    id_log INT PRIMARY KEY AUTO_INCREMENT,
    id_mutasi INT NOT NULL, -- Referensi ke tabel PengajuanMutasi
    user_id INT NOT NULL, -- ID pengguna yang melakukan aktivitas
    action VARCHAR(100) NOT NULL, -- Misalnya: "Pengajuan Dibuat", "Persetujuan Diberikan"
    details TEXT, -- Detail aktivitas, misalnya: "Mutasi Disetujui oleh Kepala Ruangan"
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_mutasi) REFERENCES PengajuanMutasi(id_mutasi)
);