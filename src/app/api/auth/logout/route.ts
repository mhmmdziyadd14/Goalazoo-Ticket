import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// POST: Menangani permintaan logout pengguna
export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    (await cookieStore).delete('token'); // Hapus cookie token untuk logout

    return NextResponse.json({ message: 'Logout berhasil' });
  } catch (error) {
    console.error('Kesalahan logout:', error);
    return NextResponse.json({ error: 'Logout gagal' }, { status: 500 });
  }
}
