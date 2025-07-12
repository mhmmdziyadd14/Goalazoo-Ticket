import { NextResponse } from 'next/server';
import pool from '@/lib/database';

// GET: Mengambil daftar semua event
export async function GET(request: Request) {
  try {
    // Pastikan 'category_id' dipilih di sini
    const [events] = await pool.query(
      'SELECT id, team1_name, team2_name, team1_logo_url, team2_logo_url, description, date, location, category_id, created_at FROM events'
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
    const { team1_name, team2_name, team1_logo_url, team2_logo_url, description, date, location, category_id } = await request.json();

    if (!team1_name || !team2_name || !date || !location || category_id === undefined || category_id === null) { // Pastikan category_id valid
      console.error('Create Event Error: Missing required fields', { team1_name, team2_name, date, location, category_id });
      return NextResponse.json({ error: 'Nama tim 1, nama tim 2, tanggal, lokasi, dan kategori wajib diisi' }, { status: 400 });
    }

    const finalTeam1LogoUrl = team1_logo_url || null;
    const finalTeam2LogoUrl = team2_logo_url || null;

    console.log('Attempting to insert new event:', { team1_name, team2_name, finalTeam1LogoUrl, finalTeam2LogoUrl, description, date, location, category_id });

    // Pastikan 'category_id' disertakan dalam query INSERT
    const [result] = await pool.query(
      'INSERT INTO events (team1_name, team2_name, team1_logo_url, team2_logo_url, description, date, location, category_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [team1_name, team2_name, finalTeam1LogoUrl, finalTeam2LogoUrl, description, date, location, category_id]
    ) as any;

    // Pastikan 'category_id' dipilih saat mengembalikan event yang baru dibuat
    const [newEvent] = await pool.query(
      'SELECT id, team1_name, team2_name, team1_logo_url, team2_logo_url, description, date, location, category_id, created_at FROM events WHERE id = ?',
      [result.insertId]
    ) as any;

    console.log('Event created successfully:', newEvent[0]);
    return NextResponse.json(newEvent[0], { status: 201 });
  } catch (error: any) {
    console.error('Create Event Error (Server-side):', error.message || error);
    if (error.code) {
      console.error('MySQL Error Code:', error.code);
      console.error('MySQL Error Message:', error.sqlMessage);
      return NextResponse.json({ error: `Gagal membuat event: ${error.sqlMessage || 'Kesalahan database'}` }, { status: 500 });
    }
    return NextResponse.json({ error: 'Gagal membuat event' }, { status: 500 });
  }
}
