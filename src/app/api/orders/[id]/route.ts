import { NextResponse } from 'next/server';
import pool from '@/lib/database';

// GET: Mengambil order berdasarkan ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const [order] = await pool.query(
      'SELECT id, user_id, event_id, tribune_id, quantity, total_price, order_date, status FROM orders WHERE id = ?',
      [id]
    ) as any;

    if (order.length === 0) {
      return NextResponse.json({ error: 'Order tidak ditemukan' }, { status: 404 });
    }
    return NextResponse.json(order[0]);
  } catch (error) {
    console.error(`Kesalahan mengambil order berdasarkan ID ${params.id}:`, error);
    return NextResponse.json({ error: 'Gagal memuat order' }, { status: 500 });
  }
}

// PUT: Memperbarui order berdasarkan ID
// Diperbarui untuk menangani pembaruan status dari halaman pembayaran
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    // Ambil semua data yang mungkin diperbarui, tapi fokus pada 'status' untuk pembayaran
    const { user_id, event_id, tribune_id, quantity, total_price, status } = await request.json();

    // Periksa apakah order ada
    const [existingOrder] = await pool.query('SELECT id FROM orders WHERE id = ?', [id]) as any;
    if (existingOrder.length === 0) {
      return NextResponse.json({ error: 'Order tidak ditemukan' }, { status: 404 });
    }

    // Jika hanya status yang dikirim (dari halaman pembayaran), update status saja
    if (status) {
      // Pastikan status adalah nilai yang valid untuk ENUM
      const validStatuses = ['pending', 'paid', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json({ error: 'Status tidak valid' }, { status: 400 });
      }
      await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);

      // Jika status berubah menjadi 'cancelled', mungkin perlu mengembalikan kursi tribun
      if (status === 'cancelled') {
        const [orderToCancel] = await pool.query('SELECT tribune_id, quantity FROM orders WHERE id = ?', [id]) as any;
        if (orderToCancel.length > 0 && orderToCancel[0].tribune_id) {
          await pool.query('UPDATE tribunes SET available_seats = available_seats + ? WHERE id = ?', [orderToCancel[0].quantity, orderToCancel[0].tribune_id]);
        }
      }
      // Jika status berubah menjadi 'paid', tidak ada perubahan kursi, hanya status order
    } else {
      // Logika pembaruan lengkap jika ada field lain yang diperbarui dari admin
      // Pastikan semua field yang diperlukan ada untuk pembaruan non-status
      if (!user_id || !event_id || !tribune_id || !quantity || total_price === undefined) {
         return NextResponse.json({ error: 'Kolom order wajib diisi untuk pembaruan lengkap' }, { status: 400 });
      }

      await pool.query(
        'UPDATE orders SET user_id = ?, event_id = ?, tribune_id = ?, quantity = ?, total_price = ?, status = ? WHERE id = ?',
        [user_id, event_id, tribune_id, quantity, total_price, status, id]
      );
    }

    // Ambil order yang diperbarui untuk dikembalikan
    const [updatedOrder] = await pool.query(
      'SELECT id, user_id, event_id, tribune_id, quantity, total_price, order_date, status FROM orders WHERE id = ?',
      [id]
    ) as any;

    return NextResponse.json(updatedOrder[0]);
  } catch (error) {
    console.error(`Kesalahan memperbarui order untuk ${params.id}:`, error);
    return NextResponse.json({ error: 'Gagal memperbarui order' }, { status: 500 });
  }
}

// DELETE: Menghapus order berdasarkan ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // Ambil detail order sebelum menghapus untuk mengembalikan kursi
    const [orderToDelete] = await pool.query('SELECT tribune_id, quantity FROM orders WHERE id = ?', [id]) as any;

    // Periksa apakah order ada
    const [existingOrder] = await pool.query('SELECT id FROM orders WHERE id = ?', [id]) as any;
    if (existingOrder.length === 0) {
      return NextResponse.json({ error: 'Order tidak ditemukan' }, { status: 404 });
    }

    await pool.query('DELETE FROM orders WHERE id = ?', [id]);

    // Kembalikan kursi ke tribun jika order dihapus
    if (orderToDelete.length > 0 && orderToDelete[0].tribune_id) {
        await pool.query('UPDATE tribunes SET available_seats = available_seats + ? WHERE id = ?', [orderToDelete[0].quantity, orderToDelete[0].tribune_id]);
    }

    return NextResponse.json({ message: 'Order berhasil dihapus' }, { status: 200 });
  } catch (error) {
    console.error(`Kesalahan menghapus order untuk ${params.id}:`, error);
    return NextResponse.json({ error: 'Gagal menghapus order' }, { status: 500 });
  }
}
