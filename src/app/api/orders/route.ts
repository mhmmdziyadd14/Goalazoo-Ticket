import { NextResponse } from 'next/server';
import pool from '@/lib/database';

// GET: Mengambil daftar semua order (Admin) atau berdasarkan user_id (User)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId'); // Opsional: filter berdasarkan userId

    let query = 'SELECT id, user_id, event_id, tribune_id, quantity, total_price, order_date, status FROM orders'; // Tambahkan tribune_id
    let params: (string | number)[] = [];

    if (userId) {
      query += ' WHERE user_id = ?';
      params.push(userId);
    }

    const [orders] = await pool.query(query, params);
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Kesalahan mengambil order:', error);
    return NextResponse.json({ error: 'Gagal memuat order' }, { status: 500 });
  }
}

// POST: Membuat order baru
export async function POST(request: Request) {
  try {
    const { user_id, event_id, tribune_id, quantity, total_price, status } = await request.json(); // Tambahkan tribune_id

    if (!user_id || !event_id || !tribune_id || !quantity || total_price === undefined || !status) { // tribune_id sekarang wajib
      return NextResponse.json({ error: 'Kolom order wajib diisi, termasuk ID tribun' }, { status: 400 });
    }

    // Opsional: Kurangi available_seats dari tribun yang dipilih
    // Ini adalah langkah krusial untuk aplikasi nyata.
    // Anda perlu mengambil detail tribun terlebih dahulu, lalu memperbarui available_seats.
    // Contoh:
    const [tribune] = await pool.query('SELECT available_seats FROM tribunes WHERE id = ?', [tribune_id]) as any;
    if (tribune.length === 0 || tribune[0].available_seats < quantity) {
      return NextResponse.json({ error: 'Tiket tribun tidak cukup atau tribun tidak ditemukan' }, { status: 400 });
    }
    await pool.query('UPDATE tribunes SET available_seats = available_seats - ? WHERE id = ?', [quantity, tribune_id]);


    const [result] = await pool.query(
      'INSERT INTO orders (user_id, event_id, tribune_id, quantity, total_price, status) VALUES (?, ?, ?, ?, ?, ?)', // Tambahkan tribune_id
      [user_id, event_id, tribune_id, quantity, total_price, status]
    ) as any;

    // Ambil order yang baru dibuat
    const [newOrder] = await pool.query(
      'SELECT id, user_id, event_id, tribune_id, quantity, total_price, order_date, status FROM orders WHERE id = ?', // Tambahkan tribune_id
      [result.insertId]
    ) as any;

    return NextResponse.json(newOrder[0], { status: 201 });
  } catch (error) {
    console.error('Kesalahan membuat order:', error);
    return NextResponse.json({ error: 'Gagal membuat order' }, { status: 500 });
  }
}
