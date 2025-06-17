import { NextResponse } from 'next/server';
import pool from '@/lib/database';

// GET: Mengambil event berdasarkan ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const [event] = await pool.query(
      'SELECT id, team1_name, team2_name, team1_logo_url, team2_logo_url, description, date, location, created_at FROM events WHERE id = ?',
      [id]
    ) as any;

    if (event.length === 0) {
      return NextResponse.json({ error: 'Event tidak ditemukan' }, { status: 404 });
    }
    return NextResponse.json(event[0]);
  } catch (error) {
    console.error(`Kesalahan mengambil event berdasarkan ID ${params.id}:`, error);
    return NextResponse.json({ error: 'Gagal memuat event' }, { status: 500 });
  }
}

// PUT: Memperbarui event berdasarkan ID
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { team1_name, team2_name, team1_logo_url, team2_logo_url, description, date, location } = await request.json();

    // Periksa apakah event ada
    const [existingEvent] = await pool.query('SELECT id FROM events WHERE id = ?', [id]) as any;
    if (existingEvent.length === 0) {
      return NextResponse.json({ error: 'Event tidak ditemukan' }, { status: 404 });
    }

    await pool.query(
      'UPDATE events SET team1_name = ?, team2_name = ?, team1_logo_url = ?, team2_logo_url = ?, description = ?, date = ?, location = ? WHERE id = ?',
      [team1_name, team2_name, team1_logo_url, team2_logo_url, description, date, location, id]
    );

    // Ambil event yang diperbarui untuk dikembalikan
    const [updatedEvent] = await pool.query(
      'SELECT id, team1_name, team2_name, team1_logo_url, team2_logo_url, description, date, location, created_at FROM events WHERE id = ?',
      [id]
    ) as any;

    return NextResponse.json(updatedEvent[0]);
  } catch (error) {
    console.error(`Kesalahan memperbarui event untuk ${params.id}:`, error);
    return NextResponse.json({ error: 'Gagal memperbarui event' }, { status: 500 });
  }
}

// DELETE: Menghapus event berdasarkan ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // Periksa apakah event ada
    const [existingEvent] = await pool.query('SELECT id FROM events WHERE id = ?', [id]) as any;
    if (existingEvent.length === 0) {
      return NextResponse.json({ error: 'Event tidak ditemukan' }, { status: 404 });
    }

    await pool.query('DELETE FROM events WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Event berhasil dihapus' }, { status: 200 });
  } catch (error) {
    console.error(`Kesalahan menghapus event untuk ${params.id}:`, error);
    return NextResponse.json({ error: 'Gagal menghapus event' }, { status: 500 });
  }
}
