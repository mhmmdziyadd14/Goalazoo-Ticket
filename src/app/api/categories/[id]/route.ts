import { NextResponse } from 'next/server';
import pool from '@/lib/database';

// GET: Mengambil kategori berdasarkan ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const [category] = await pool.query(
      'SELECT id, name, description, created_at FROM categories WHERE id = ?',
      [id]
    ) as any;

    if (category.length === 0) {
      return NextResponse.json({ error: 'Kategori tidak ditemukan' }, { status: 404 });
    }
    return NextResponse.json(category[0]);
  } catch (error) {
    console.error(`Kesalahan mengambil kategori berdasarkan ID ${params.id}:`, error);
    return NextResponse.json({ error: 'Gagal memuat kategori' }, { status: 500 });
  }
}

// PUT: Memperbarui kategori berdasarkan ID
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { name, description } = await request.json();

    // Periksa apakah kategori ada
    const [existingCategory] = await pool.query('SELECT id FROM categories WHERE id = ?', [id]) as any;
    if (existingCategory.length === 0) {
      return NextResponse.json({ error: 'Kategori tidak ditemukan' }, { status: 404 });
    }

    if (!name) {
        return NextResponse.json({ error: 'Nama kategori wajib diisi' }, { status: 400 });
    }

    await pool.query(
      'UPDATE categories SET name = ?, description = ? WHERE id = ?',
      [name, description || null, id]
    );

    const [updatedCategory] = await pool.query(
      'SELECT id, name, description, created_at FROM categories WHERE id = ?',
      [id]
    ) as any;

    return NextResponse.json(updatedCategory[0]);
  } catch (error: any) {
    console.error(`Kesalahan memperbarui kategori untuk ${params.id}:`, error);
    if (error.code) { // Tangani error duplikasi nama
        if (error.code === 'ER_DUP_ENTRY') {
            return NextResponse.json({ error: `Nama kategori '${name}' sudah ada.` }, { status: 409 });
        }
    }
    return NextResponse.json({ error: 'Gagal memperbarui kategori' }, { status: 500 });
  }
}

// DELETE: Menghapus kategori berdasarkan ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // Periksa apakah kategori ada
    const [existingCategory] = await pool.query('SELECT id FROM categories WHERE id = ?', [id]) as any;
    if (existingCategory.length === 0) {
      return NextResponse.json({ error: 'Kategori tidak ditemukan' }, { status: 404 });
    }

    // Periksa apakah ada event yang terkait dengan kategori ini (karena ON DELETE RESTRICT)
    const [relatedEvents] = await pool.query('SELECT id FROM events WHERE category_id = ?', [id]) as any;
    if (relatedEvents.length > 0) {
        return NextResponse.json({ error: 'Tidak dapat menghapus kategori: ada event yang terkait.' }, { status: 409 });
    }

    await pool.query('DELETE FROM categories WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Kategori berhasil dihapus' }, { status: 200 });
  } catch (error: any) {
    console.error(`Kesalahan menghapus kategori untuk ${params.id}:`, error);
    return NextResponse.json({ error: 'Gagal menghapus kategori' }, { status: 500 });
  }
}
