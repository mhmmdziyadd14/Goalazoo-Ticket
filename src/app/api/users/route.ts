import { NextResponse } from 'next/server';
import pool from '@/lib/database';

// GET: Mengambil daftar semua user (Hanya untuk Admin)
export async function GET(request: Request) {
  try {
    // Di sini Anda dapat menambahkan middleware autentikasi/otorisasi
    // untuk memastikan hanya admin yang dapat mengakses rute ini.
    const [users] = await pool.query(
      'SELECT id, username, email, role, created_at FROM users' // JANGAN kembalikan password
    );
    return NextResponse.json(users);
  } catch (error) {
    console.error('Kesalahan mengambil user:', error);
    return NextResponse.json({ error: 'Gagal memuat user' }, { status: 500 });
  }
}

// POST: Menambahkan user baru (Hanya untuk Admin, atau alternatif register)
export async function POST(request: Request) {
  try {
    const { username, email, password, role } = await request.json();

    if (!username || !email || !password || !role) {
      return NextResponse.json({ error: 'Kolom user wajib diisi' }, { status: 400 });
    }

    const [exists] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    ) as any;

    if (exists.length > 0) {
      return NextResponse.json({ error: 'Email sudah terdaftar' }, { status: 409 });
    }

    const [result] = await pool.query(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      [username, email, password, role]
    ) as any;

    // Ambil user yang baru dibuat (tanpa password)
    const [newUser] = await pool.query(
      'SELECT id, username, email, role, created_at FROM users WHERE id = ?',
      [result.insertId]
    ) as any;

    return NextResponse.json(newUser[0], { status: 201 });
  } catch (error) {
    console.error('Kesalahan membuat user:', error);
    return NextResponse.json({ error: 'Gagal membuat user' }, { status: 500 });
  }
}
