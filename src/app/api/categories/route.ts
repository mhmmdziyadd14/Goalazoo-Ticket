import { NextResponse } from 'next/server';
import pool from '@/lib/database';

// GET: Mengambil daftar semua kategori
export async function GET(request: Request) {
  try {
    const [categories] = await pool.query(
      'SELECT id, name, description, created_at FROM categories'
    );
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Kesalahan mengambil kategori:', error);
    return NextResponse.json({ error: 'Gagal memuat kategori' }, { status: 500 });
  }
}

// POST: Menambahkan kategori baru
export async function POST(request: Request) {
  try {
    const { name, description } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'Nama kategori wajib diisi' }, { status: 400 });
    }

    // Periksa apakah nama kategori sudah ada
    const [existingCategory] = await pool.query(
      'SELECT id FROM categories WHERE name = ?',
      [name]
    ) as any;

    if (existingCategory.length > 0) {
      return NextResponse.json({ error: 'Nama kategori sudah ada' }, { status: 409 });
    }

    const [result] = await pool.query(
      'INSERT INTO categories (name, description) VALUES (?, ?)',
      [name, description || null] // description bisa null
    ) as any;

    const [newCategory] = await pool.query(
      'SELECT id, name, description, created_at FROM categories WHERE id = ?',
      [result.insertId]
    ) as any;

    return NextResponse.json(newCategory[0], { status: 201 });
  } catch (error: any) {
    console.error('Kesalahan membuat kategori:', error);
    if (error.code) {
      console.error('MySQL Error Code:', error.code);
      console.error('MySQL Error Message:', error.sqlMessage);
      return NextResponse.json({ error: `Gagal membuat kategori: ${error.sqlMessage || 'Kesalahan database'}` }, { status: 500 });
    }
    return NextResponse.json({ error: 'Gagal membuat kategori' }, { status: 500 });
  }
}
