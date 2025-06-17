import { NextResponse } from 'next/server';
import pool from '@/lib/database';

// GET: Mengambil user berdasarkan ID (Hanya untuk Admin)
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    // Implementasi autentikasi/otorisasi di sini
    const [user] = await pool.query(
      'SELECT id, username, email, role, created_at FROM users WHERE id = ?', // JANGAN kembalikan password
      [id]
    ) as any;

    if (user.length === 0) {
      return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 });
    }
    return NextResponse.json(user[0]);
  } catch (error) {
    console.error(`Kesalahan mengambil user berdasarkan ID ${params.id}:`, error);
    return NextResponse.json({ error: 'Gagal memuat user' }, { status: 500 });
  }
}

// PUT: Memperbarui user berdasarkan ID (Hanya untuk Admin)
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { username, email, role } = await request.json(); // Pembaruan password harus ditangani secara terpisah untuk keamanan

    // Periksa apakah user ada
    const [existingUser] = await pool.query('SELECT id FROM users WHERE id = ?', [id]) as any;
    if (existingUser.length === 0) {
      return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 });
    }

    await pool.query(
      'UPDATE users SET username = ?, email = ?, role = ? WHERE id = ?',
      [username, email, role, id]
    );

    // Ambil user yang diperbarui (tanpa password)
    const [updatedUser] = await pool.query(
      'SELECT id, username, email, role, created_at FROM users WHERE id = ?',
      [id]
    ) as any;

    return NextResponse.json(updatedUser[0]);
  } catch (error) {
    console.error(`Kesalahan memperbarui user untuk ${params.id}:`, error);
    return NextResponse.json({ error: 'Gagal memperbarui user' }, { status: 500 });
  }
}

// DELETE: Menghapus user berdasarkan ID (Hanya untuk Admin)
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // Periksa apakah user ada
    const [existingUser] = await pool.query('SELECT id FROM users WHERE id = ?', [id]) as any;
    if (existingUser.length === 0) {
      return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 });
    }

    await pool.query('DELETE FROM users WHERE id = ?', [id]);
    return NextResponse.json({ message: 'User berhasil dihapus' }, { status: 200 });
  } catch (error) {
    console.error(`Kesalahan menghapus user untuk ${params.id}:`, error);
    return NextResponse.json({ error: 'Gagal menghapus user' }, { status: 500 });
  }
}
