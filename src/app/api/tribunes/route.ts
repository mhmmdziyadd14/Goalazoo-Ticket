import { NextResponse } from 'next/server';
import pool from '@/lib/database';

// GET: Mengambil daftar semua tribun atau tribun berdasarkan event_id
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId'); // Filter opsional berdasarkan event_id

    let query = 'SELECT id, event_id, name, price, available_seats, created_at FROM tribunes';
    let params: (string | number)[] = [];

    if (eventId) {
      query += ' WHERE event_id = ?';
      params.push(eventId);
    }

    const [tribunes] = await pool.query(query, params);
    return NextResponse.json(tribunes);
  } catch (error) {
    console.error('Kesalahan mengambil tribun:', error);
    return NextResponse.json({ error: 'Gagal memuat tribun' }, { status: 500 });
  }
}

// POST: Menambahkan tribun baru
export async function POST(request: Request) {
  try {
    const { event_id, name, price, available_seats } = await request.json();

    if (!event_id || !name || price === undefined || available_seats === undefined) {
      return NextResponse.json({ error: 'Kolom tribun wajib diisi' }, { status: 400 });
    }

    // Periksa apakah nama tribun sudah ada untuk event ini
    const [existingTribune] = await pool.query(
      'SELECT id FROM tribunes WHERE event_id = ? AND name = ?',
      [event_id, name]
    ) as any;

    if (existingTribune.length > 0) {
      return NextResponse.json({ error: 'Nama tribun sudah ada untuk event ini' }, { status: 409 });
    }

    const [result] = await pool.query(
      'INSERT INTO tribunes (event_id, name, price, available_seats) VALUES (?, ?, ?, ?)',
      [event_id, name, price, available_seats]
    ) as any;

    // Ambil tribun yang baru dibuat untuk dikembalikan dengan ID-nya
    const [newTribune] = await pool.query(
      'SELECT id, event_id, name, price, available_seats, created_at FROM tribunes WHERE id = ?',
      [result.insertId]
    ) as any;

    return NextResponse.json(newTribune[0], { status: 201 });
  } catch (error) {
    console.error('Kesalahan membuat tribun:', error);
    return NextResponse.json({ error: 'Gagal membuat tribun' }, { status: 500 });
  }
}
