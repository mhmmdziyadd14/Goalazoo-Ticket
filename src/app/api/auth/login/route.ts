import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import pool from '@/lib/database';
import { createToken, verifyToken } from '@/lib/auth';

// POST: Menangani permintaan login pengguna
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Query database untuk mencari user dengan email dan password yang cocok
    const [users] = await pool.query(
      'SELECT id, username, email, role FROM users WHERE email = ? AND password = ?',
      [email, password]
    ) as any;

    // Jika user tidak ditemukan, kembalikan respons 401 Unauthorized
    if (users.length === 0) {
      return NextResponse.json({ error: 'Kredensial tidak valid' }, { status: 401 });
    }

    const user = users[0];
    // Buat token JWT untuk user yang terautentikasi
    const token = createToken({ id: user.id, email: user.email, role: user.role });

    // Akses cookie store untuk mengatur token
    const cookieStore = cookies();
    // Atur cookie 'token' dengan token yang dihasilkan
    (await
          // Atur cookie 'token' dengan token yang dihasilkan
          cookieStore).set('token', token, {
      httpOnly: true, // Membuat cookie tidak dapat diakses oleh JavaScript sisi klien
      secure: process.env.NODE_ENV === 'production', // Kirim cookie hanya melalui HTTPS di produksi
      maxAge: 60 * 60 * 24 * 7, // 1 minggu
      path: '/', // Path di mana cookie valid
    });

    // Kembalikan pesan sukses dan data user (tanpa password)
    return NextResponse.json({ message: 'Login berhasil', user: { id: user.id, username: user.username, email: user.email, role: user.role } });

  } catch (error) {
    console.error('Kesalahan login:', error);
    return NextResponse.json({ error: 'Login gagal' }, { status: 500 });
  }
}

// GET: Memeriksa status autentikasi pengguna
export async function GET(request: Request) {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get('token')?.value;

    // Jika tidak ada token, pengguna tidak terautentikasi
    if (!token) {
      return NextResponse.json({ isAuthenticated: false, user: null }, { status: 401 });
    }

    let decodedUser;
    try {
      // Verifikasi token dan dekode informasi user
      decodedUser = verifyToken(token);
    } catch (error) {
      // Jika verifikasi token gagal (misalnya, kadaluarsa, tanda tangan tidak valid),
      // hapus cookie dan kembalikan status tidak terautentikasi
      console.error('Verifikasi token gagal:', error);
      (await cookieStore).delete('token'); // Hapus token yang tidak valid
      return NextResponse.json({ isAuthenticated: false, user: null }, { status: 401 });
    }

    // Jika token valid, kembalikan status terautentikasi dan informasi user
    return NextResponse.json({ isAuthenticated: true, user: decodedUser });

  } catch (error) {
    console.error('Kesalahan pemeriksaan autentikasi:', error);
    return NextResponse.json({ error: 'Pemeriksaan autentikasi gagal' }, { status: 500 });
  }
}
