const express = require('express');
const mysql = require('mysql2');
const app = express();
app.use(express.json());

// Koneksi ke database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'simpeg'
});

// Middleware untuk logging audit
function logAudit(user_id, action, table_name, record_id, details) {
    const query = `
        INSERT INTO AuditLog (user_id, action, table_name, record_id, details)
        VALUES (?, ?, ?, ?, ?)
    `;
    db.query(query, [user_id, action, table_name, record_id, details], (err, result) => {
        if (err) console.error('Audit log error:', err);
    });
}

// Contoh endpoint untuk menambahkan pegawai
app.post('/pegawai', (req, res) => {
    const { nama, nip, created_by } = req.body;
    const query = `
        INSERT INTO Pegawai (nama, nip, created_by)
        VALUES (?, ?, ?)
    `;
    db.query(query, [nama, nip, created_by], (err, result) => {
        if (err) return res.status(500).send(err);

        // Log audit
        logAudit(created_by, 'INSERT', 'Pegawai', result.insertId, `New record created: ${nama}`);
        res.status(201).send({ message: 'Pegawai created successfully' });
    });
});

// Contoh endpoint untuk memperbarui pegawai
app.put('/pegawai/:id', (req, res) => {
    const { id } = req.params;
    const { nama, updated_by } = req.body;
    const query = `
        UPDATE Pegawai
        SET nama = ?, updated_by = ?
        WHERE id_pegawai = ?
    `;
    db.query(query, [nama, updated_by, id], (err, result) => {
        if (err) return res.status(500).send(err);

        // Log audit
        logAudit(updated_by, 'UPDATE', 'Pegawai', id, `Record updated: ${nama}`);
        res.status(200).send({ message: 'Pegawai updated successfully' });
    });
});

// Jalankan server
app.listen(3000, () => console.log('Server running on port 3000'));