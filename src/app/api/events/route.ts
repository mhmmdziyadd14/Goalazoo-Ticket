import { NextResponse } from 'next/server';
import pool from '@/lib/database';

// GET: Mengambil daftar semua event
export async function GET(request: Request) {
  try {
    // Memilih semua kolom termasuk yang baru (tanpa 'name', 'price', 'available_tickets')
    const [events] = await pool.query(
      'SELECT id, team1_name, team2_name, team1_logo_url, team2_logo_url, description, date, location, created_at FROM events'
    );
    return NextResponse.json(events);
  } catch (error) {
    console.error('Kesalahan mengambil event:', error);
    return NextResponse.json({ error: 'Gagal memuat event' }, { status: 500 });
  }
}

// POST: Menambahkan event baru
export async function POST(request: Request) {
  try {
    const { team1_name, team2_name, team1_logo_url, team2_logo_url, description, date, location } = await request.json();

    // Validasi input: pastikan nama tim, tanggal, dan lokasi ada
    if (!team1_name || !team2_name || !date || !location) {
      console.error('Create Event Error: Missing required fields', { team1_name, team2_name, date, location });
      return NextResponse.json({ error: 'Nama tim 1, nama tim 2, tanggal, dan lokasi wajib diisi' }, { status: 400 });
    }

    // Pastikan URL logo adalah string, jika kosong jadikan NULL atau string kosong
    const finalTeam1LogoUrl = team1_logo_url || null; // Simpan sebagai NULL jika kosong
    const finalTeam2LogoUrl = team2_logo_url || null; // Simpan sebagai NULL jika kosong

    console.log('Attempting to insert new event:', { team1_name, team2_name, finalTeam1LogoUrl, finalTeam2LogoUrl, description, date, location });

    const [result] = await pool.query(
      // Pastikan query INSERT hanya memasukkan kolom-kolom yang ada di tabel Anda
      'INSERT INTO events (team1_name, team2_name, team1_logo_url, team2_logo_url, description, date, location) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [team1_name, team2_name, finalTeam1LogoUrl, finalTeam2LogoUrl, description, date, location]
    ) as any;

    // Ambil event yang baru dibuat untuk dikembalikan dengan ID-nya
    const [newEvent] = await pool.query(
      // Pastikan query SELECT hanya memilih kolom-kolom yang ada di tabel Anda
      'SELECT id, team1_name, team2_name, team1_logo_url, team2_logo_url, description, date, location, created_at FROM events WHERE id = ?',
      [result.insertId]
    ) as any;

    console.log('Event created successfully:', newEvent[0]);
    return NextResponse.json(newEvent[0], { status: 201 });
  } catch (error: any) {
    // Log error secara detail di sisi server
    console.error('Create Event Error (Server-side):', error.message || error);
    // Jika error memiliki kode spesifik (misalnya dari MySQL)
    if (error.code) {
      console.error('MySQL Error Code:', error.code);
      console.error('MySQL Error Message:', error.sqlMessage);
      return NextResponse.json({ error: `Gagal membuat event: ${error.sqlMessage || 'Kesalahan database'}` }, { status: 500 });
    }
    return NextResponse.json({ error: 'Gagal membuat event' }, { status: 500 });
  }
}
