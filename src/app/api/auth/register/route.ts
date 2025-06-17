import { NextResponse } from 'next/server';
import pool from '@/lib/database';

// POST: Menangani permintaan pendaftaran user baru
export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();

    // Validasi input dasar
    if (!username || !email || !password) {
      // Log kesalahan validasi input
      console.error('Register Error: Missing required fields', { username, email, password: '***' });
      return NextResponse.json({ error: 'Nama pengguna, email, dan password wajib diisi' }, { status: 400 });
    }

    // Periksa apakah email sudah terdaftar
    const [exists] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    ) as any;

    if (exists.length > 0) {
      // Log kesalahan email sudah terdaftar
      console.warn('Register Warning: Email already registered', { email });
      return NextResponse.json({ error: 'Email sudah terdaftar' }, { status: 409 });
    }

    // Masukkan user baru ke database dengan peran default 'user'
    // Log data yang akan dimasukkan
    console.log('Attempting to insert new user:', { username, email, role: 'user' });
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      [username, email, password, 'user'] // Peran default adalah 'user'
    ) as any;

    // Ambil user yang baru dibuat (tanpa password) untuk dikembalikan
    const [newUser] = await pool.query(
      'SELECT id, username, email, role, created_at FROM users WHERE id = ?',
      [result.insertId]
    ) as any;

    // Log sukses pendaftaran
    console.log('User registered successfully:', newUser[0]);
    return NextResponse.json({ message: 'Pendaftaran berhasil', user: newUser[0] }, { status: 201 });

  } catch (error: any) { // Tangkap error sebagai 'any' untuk mengakses properti 'message'
    // Log error secara detail di sisi server
    console.error('Register Error (Server-side):', error.message || error);
    // Jika error memiliki kode spesifik (misalnya dari MySQL)
    if (error.code) {
      console.error('MySQL Error Code:', error.code);
      console.error('MySQL Error Message:', error.sqlMessage);
      return NextResponse.json({ error: `Pendaftaran gagal: ${error.sqlMessage || 'Kesalahan database'}` }, { status: 500 });
    }
    return NextResponse.json({ error: 'Pendaftaran gagal' }, { status: 500 });
  }
}
