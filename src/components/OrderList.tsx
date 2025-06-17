"use client";

import React, { useState, useEffect } from 'react';
import { Order, Event, User, Tribune, Category } from '@/app/types';
import { fetchOrders, deleteOrder, updateOrderStatus, fetchEvents, fetchUsers, fetchTribunesByEvent, fetchCategories } from '@/lib/api';
import {
  RiEditLine,
  RiDeleteBinLine,
  RiCloseLine,
  RiCheckLine,
  RiTicketLine,
  RiUserLine,
  RiCalendarEventLine,
  RiMoneyDollarCircleLine,
  RiTimeLine,
  RiLoader4Line
} from 'react-icons/ri';
import { MdStadium } from "react-icons/md";

interface OrderListProps {
  showMessage: (msg: string, type: 'success' | 'error') => void;
}

const OrderList: React.FC<OrderListProps> = ({ showMessage }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [tribunes, setTribunes] = useState<Tribune[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false); // State untuk status update

  const loadOrders = async () => {
    setLoading(true);
    try {
      const [ordersData, eventsData, usersData, categoriesData] = await Promise.all([
        fetchOrders(),
        fetchEvents(),
        fetchUsers(),
        fetchCategories()
      ]);

      const allTribunes: Tribune[] = [];
      for (const event of eventsData) {
        try {
          const eventTribunes = await fetchTribunesByEvent(event.id);
          allTribunes.push(...eventTribunes);
        } catch (error) {
          console.warn(`Could not fetch tribunes for event ${event.id}:`, error);
          return []; // Mengembalikan array kosong jika gagal
        }
      }
      setTribunes(allTribunes);

      setOrders(ordersData);
      setEvents(eventsData);
      setUsers(usersData);
      setCategories(categoriesData);
    } catch (error: any) {
      showMessage(error.message || 'Gagal memuat pesanan.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const getEventName = (eventId: number) => {
    const event = events.find(e => e.id === eventId);
    return event ? `${event.team1_name} vs ${event.team2_name}` : 'Acara Tidak Dikenal';
  };

  const getCategoryName = (eventId: number) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return 'Tidak Dikenal';
    const category = categories.find(cat => cat.id === event.category_id);
    return category ? category.name : 'Tidak Dikenal';
  };

  const getUserIdentifier = (userId: number) => {
    const user = users.find(u => u.id === userId);
    return user ? user.username || user.email : 'Pengguna Tidak Dikenal';
  };

  const getTribuneName = (tribuneId?: number) => {
    if (!tribuneId) return 'N/A';
    const tribune = tribunes.find(t => t.id === tribuneId);
    return tribune ? tribune.name : 'Tribun Tidak Dikenal';
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pesanan ini?')) {
      try {
        await deleteOrder(id);
        showMessage('Pesanan berhasil dihapus!', 'success');
        loadOrders();
      } catch (error: any) {
        showMessage(error.message || 'Gagal menghapus pesanan.', 'error');
      }
    }
  };

  const handleEdit = (order: Order) => {
    setEditingOrder({ ...order });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;

    setIsUpdating(true); // Mulai loading update
    try {
      await updateOrderStatus(editingOrder.id, editingOrder.status);
      showMessage('Status pesanan berhasil diperbarui!', 'success');
      setEditingOrder(null);
      loadOrders();
    } catch (error: any) {
      showMessage(error.message || 'Gagal memperbarui pesanan.', 'error');
    } finally {
      setIsUpdating(false); // Hentikan loading update
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
        <h3 className="text-2xl font-bold flex items-center">
          <RiTicketLine className="mr-3" />
          Daftar Pesanan
        </h3>
        <p className="text-blue-100 mt-1">Kelola semua pesanan tiket pertandingan</p>
      </div>

      <div className="p-6">
        {orders.length === 0 ? (
          <div className="text-center py-8">
            <RiTicketLine className="mx-auto text-4xl text-gray-400 mb-4" />
            <p className="text-gray-600">Tidak ada pesanan yang tersedia.</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {orders.map((order) => {
              const event = events.find(e => e.id === order.event_id);
              const tribune = tribunes.find(t => t.id === order.tribune_id);
              const user = users.find(u => u.id === order.user_id);

              return (
                <div key={order.id} className="bg-gray-50 rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  {editingOrder?.id === order.id ? (
                    // Edit Form
                    <form onSubmit={handleUpdate} className="p-4 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                            <RiUserLine className="mr-2" /> Pengguna
                          </label>
                          <div className="px-4 py-2 bg-gray-100 rounded-lg text-gray-900">
                            {getUserIdentifier(editingOrder.user_id)}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                            <RiCalendarEventLine className="mr-2" /> Pertandingan
                          </label>
                          <div className="px-4 py-2 bg-gray-100 rounded-lg text-gray-900">
                            {getEventName(editingOrder.event_id)}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                            <MdStadium className="mr-2" /> Tribun
                          </label>
                          <div className="px-4 py-2 bg-gray-100 rounded-lg text-gray-900">
                            {getTribuneName(editingOrder.tribune_id)}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                            <RiMoneyDollarCircleLine className="mr-2" /> Total Harga
                          </label>
                          <div className="px-4 py-2 bg-gray-100 rounded-lg text-gray-900">
                            Rp{parseFloat(order.total_price.toString()).toFixed(2).replace('.', ',')}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                            <RiTicketLine className="mr-2" /> Jumlah Tiket
                          </label>
                          <input
                            type="number"
                            value={editingOrder.quantity}
                            onChange={(e) => setEditingOrder({ ...editingOrder, quantity: parseInt(e.target.value) })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-gray-900 placeholder-gray-700"
                            min="1"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                            <RiTimeLine className="mr-2" /> Status
                          </label>
                          <select
                            value={editingOrder.status}
                            onChange={(e) => setEditingOrder({ ...editingOrder, status: e.target.value as 'pending' | 'paid' | 'cancelled' })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-gray-900 appearance-none"
                          >
                            <option value="pending">Pending</option>
                            <option value="paid">Lunas</option>
                            <option value="cancelled">Dibatalkan</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setEditingOrder(null)}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition flex items-center gap-2"
                        >
                          <RiCloseLine /> Batal
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-70"
                          disabled={isUpdating}
                        >
                          {isUpdating ? (
                            <RiLoader4Line className="animate-spin" />
                          ) : (
                            <RiCheckLine />
                          )}
                          Simpan
                        </button>
                      </div>
                    </form>
                  ) : (
                    // Display Mode (diperbaiki di sini)
                    <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-bold text-lg text-gray-800 flex items-center">
                          <RiTicketLine className="mr-2 text-blue-600" />
                          Pesanan #{order.id}
                        </h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === 'paid' ? 'bg-green-100 text-green-800' :
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {order.status === 'paid' ? 'Lunas' :
                           order.status === 'pending' ? 'Pending' : 'Dibatalkan'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 text-sm mb-4">
                        <div className="flex items-center">
                          <RiUserLine className="mr-2 flex-shrink-0 text-gray-500" />
                          <span className="text-gray-700">Pengguna:</span>
                          <span className="ml-1 font-medium text-gray-800 truncate">{getUserIdentifier(order.user_id)}</span>
                        </div>
                        <div className="flex items-center">
                          <RiCalendarEventLine className="mr-2 flex-shrink-0 text-gray-500" />
                          <span className="text-gray-700">Pertandingan:</span>
                          <span className="ml-1 font-medium text-gray-800 truncate">{getEventName(order.event_id)}</span>
                        </div>
                        <div className="flex items-center">
                          <MdStadium className="mr-2 flex-shrink-0 text-gray-500" />
                          <span className="text-gray-700">Tribun:</span>
                          <span className="ml-1 font-medium text-gray-800 truncate">{getTribuneName(order.tribune_id)}</span>
                        </div>
                        <div className="flex items-center">
                          <RiMoneyDollarCircleLine className="mr-2 flex-shrink-0 text-gray-500" />
                          <span className="text-gray-700">Total:</span>
                          <span className="ml-1 font-semibold text-blue-600">Rp{parseFloat(order.total_price.toString()).toFixed(2).replace('.', ',')}</span>
                        </div>
                        <div className="flex items-center md:col-span-2"> {/* Span 2 kolom untuk tanggal */}
                          <RiTimeLine className="mr-2 flex-shrink-0 text-gray-500" />
                          <span className="text-gray-700">Tanggal Pesanan:</span>
                          <span className="ml-1 text-gray-700">{new Date(order.order_date || '').toLocaleString('id-ID', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}</span>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 mt-4">
                        <button
                          onClick={() => handleEdit(order)}
                          className="flex items-center px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-200 text-sm"
                          title="Edit Status"
                        >
                          <RiEditLine className="mr-1" /> Edit Status
                        </button>
                        <button
                          onClick={() => handleDelete(order.id)}
                          className="flex items-center px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200 text-sm"
                          title="Hapus"
                        >
                          <RiDeleteBinLine className="mr-1" /> Hapus
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderList;
