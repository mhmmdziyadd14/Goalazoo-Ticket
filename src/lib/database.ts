// src/lib/database.ts
import mysql from 'mysql2/promise';

// Membuat pool koneksi database untuk efisiensi
const pool = mysql.createPool({
  host: process.env.DB_HOST,         // Host database dari .env.local
  user: process.env.DB_USER,         // User database dari .env.local
  password: process.env.DB_PASSWORD, // Password database dari .env.local
  database: process.env.DB_NAME,     // Nama database dari .env.local
  waitForConnections: true,          // Menunggu koneksi jika pool habis
  connectionLimit: 10,               // Batas jumlah koneksi dalam pool
  queueLimit: 0                      // Tidak ada batasan antrian untuk koneksi
});

export default pool;
