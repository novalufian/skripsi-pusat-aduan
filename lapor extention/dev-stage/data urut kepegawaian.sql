-- Tabel Pegawai
CREATE TABLE Pegawai (
    id_pegawai INT PRIMARY KEY AUTO_INCREMENT,
    no_urut INT NOT NULL,
    nama VARCHAR(255) NOT NULL,
    nip VARCHAR(50) UNIQUE NOT NULL,
    tempat_lahir VARCHAR(100),
    tanggal_lahir DATE,
    umur INT,
    jenis_kelamin ENUM('Laki-laki', 'Perempuan'),
    agama VARCHAR(50),
    nik VARCHAR(50),
    no_kk VARCHAR(50),
    alamat_ktp TEXT,
    alamat_domisili TEXT,
    no_hp VARCHAR(15),
    email VARCHAR(100),
    npwp VARCHAR(50),
    bpjs VARCHAR(50),
    nama_bank_gaji VARCHAR(100),
    no_rekening VARCHAR(50),
    status_perkawinan VARCHAR(50),
    nama_pasangan VARCHAR(255),
    nama_anak TEXT,
    status_pekerjaan ENUM('PNS', 'Non-PNS') DEFAULT 'PNS',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT, -- ID pengguna yang membuat data
    updated_by INT, -- ID pengguna yang memperbarui data
    is_deleted BOOLEAN DEFAULT FALSE -- Soft delete flag
);

-- Tabel Kepangkatan
CREATE TABLE Kepangkatan (
    id_kepangkatan INT PRIMARY KEY AUTO_INCREMENT,
    id_pegawai INT,
    pangkat VARCHAR(100),
    golongan VARCHAR(10),
    tmt_pangkat DATE,
    no_sk_pangkat VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT,
    is_deleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_pegawai) REFERENCES Pegawai(id_pegawai)
);

-- Tabel Jabatan
CREATE TABLE Jabatan (
    id_jabatan INT PRIMARY KEY AUTO_INCREMENT,
    id_pegawai INT,
    nama_jabatan VARCHAR(255),
    tmt_jabatan DATE,
    eselon VARCHAR(50),
    masa_kerja_tahun INT,
    masa_kerja_bulan INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT,
    is_deleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_pegawai) REFERENCES Pegawai(id_pegawai)
);

-- Tabel Pendidikan
CREATE TABLE Pendidikan (
    id_pendidikan INT PRIMARY KEY AUTO_INCREMENT,
    id_pegawai INT,
    tingkat_pendidikan VARCHAR(50),
    jurusan VARCHAR(100),
    tahun_lulus YEAR,
    gelar VARCHAR(50),
    no_str VARCHAR(100),
    tgl_terbit_str DATE,
    no_sip VARCHAR(100),
    tgl_terbit_sip DATE,
    tgl_akhir_sip DATE,
    sip_ke INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT,
    is_deleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_pegawai) REFERENCES Pegawai(id_pegawai)
);

-- Tabel Pelatihan
CREATE TABLE Pelatihan (
    id_pelatihan INT PRIMARY KEY AUTO_INCREMENT,
    id_pegawai INT,
    nama_pelatihan VARCHAR(255),
    tempat_pelatihan VARCHAR(100),
    tahun_lulus YEAR,
    jam_pelatihan INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT,
    is_deleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_pegawai) REFERENCES Pegawai(id_pegawai)
);

-- Tabel Penghargaan
CREATE TABLE Penghargaan (
    id_penghargaan INT PRIMARY KEY AUTO_INCREMENT,
    id_pegawai INT,
    nama_penghargaan VARCHAR(255),
    keterangan TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT,
    is_deleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_pegawai) REFERENCES Pegawai(id_pegawai)
);

-- Tabel Dokumen
CREATE TABLE Dokumen (
    id_dokumen INT PRIMARY KEY AUTO_INCREMENT,
    id_pegawai INT,
    no_sk_cpns VARCHAR(100),
    no_sk_pns VARCHAR(100),
    no_karpeg VARCHAR(100),
    no_karis VARCHAR(100),
    no_karsu VARCHAR(100),
    no_taspen VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT,
    is_deleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_pegawai) REFERENCES Pegawai(id_pegawai)
);

-- Tabel Riwayat Pekerjaan
CREATE TABLE RiwayatPekerjaan (
    id_riwayat INT PRIMARY KEY AUTO_INCREMENT,
    id_pegawai INT,
    nama_instansi VARCHAR(255),
    posisi VARCHAR(255),
    periode_awal DATE,
    periode_akhir DATE,
    keterangan TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT,
    is_deleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_pegawai) REFERENCES Pegawai(id_pegawai)
);

-- Tabel Riwayat Penyakit
CREATE TABLE RiwayatPenyakit (
    id_riwayat_penyakit INT PRIMARY KEY AUTO_INCREMENT,
    id_pegawai INT,
    nama_penyakit VARCHAR(255),
    tahun_diagnosis YEAR,
    keterangan TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT,
    is_deleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_pegawai) REFERENCES Pegawai(id_pegawai)
);

-- Tabel Audit Log
CREATE TABLE AuditLog (
    id_log INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action VARCHAR(100),
    table_name VARCHAR(100),
    record_id INT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    details TEXT
);