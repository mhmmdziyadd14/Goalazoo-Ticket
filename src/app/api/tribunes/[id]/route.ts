import { NextResponse } from 'next/server';
import pool from '@/lib/database';

// GET: Mengambil tribun berdasarkan ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const [tribune] = await pool.query(
      'SELECT id, event_id, name, price, available_seats, created_at FROM tribunes WHERE id = ?',
      [id]
    ) as any;

    if (tribune.length === 0) {
      return NextResponse.json({ error: 'Tribun tidak ditemukan' }, { status: 404 });
    }
    return NextResponse.json(tribune[0]);
  } catch (error) {
    console.error(`Kesalahan mengambil tribun berdasarkan ID ${params.id}:`, error);
    return NextResponse.json({ error: 'Gagal memuat tribun' }, { status: 500 });
  }
}

// PUT: Memperbarui tribun berdasarkan ID
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { name, price, available_seats } = await request.json(); // event_id tidak boleh diubah

    // Periksa apakah tribun ada
    const [existingTribune] = await pool.query('SELECT id FROM tribunes WHERE id = ?', [id]) as any;
    if (existingTribune.length === 0) {
      return NextResponse.json({ error: 'Tribun tidak ditemukan' }, { status: 404 });
    }

    await pool.query(
      'UPDATE tribunes SET name = ?, price = ?, available_seats = ? WHERE id = ?',
      [name, price, available_seats, id]
    );

    // Ambil tribun yang diperbarui untuk dikembalikan
    const [updatedTribune] = await pool.query(
      'SELECT id, event_id, name, price, available_seats, created_at FROM tribunes WHERE id = ?',
      [id]
    ) as any;

    return NextResponse.json(updatedTribune[0]);
  } catch (error) {
    console.error(`Kesalahan memperbarui tribun untuk ${params.id}:`, error);
    return NextResponse.json({ error: 'Gagal memperbarui tribun' }, { status: 500 });
  }
}

// DELETE: Menghapus tribun berdasarkan ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // Periksa apakah tribun ada
    const [existingTribune] = await pool.query('SELECT id FROM tribunes WHERE id = ?', [id]) as any;
    if (existingTribune.length === 0) {
      return NextResponse.json({ error: 'Tribun tidak ditemukan' }, { status: 404 });
    }

    await pool.query('DELETE FROM tribunes WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Tribun berhasil dihapus' }, { status: 200 });
  } catch (error) {
    console.error(`Kesalahan menghapus tribun untuk ${params.id}:`, error);
    return NextResponse.json({ error: 'Gagal menghapus tribun' }, { status: 500 });
  }
}
