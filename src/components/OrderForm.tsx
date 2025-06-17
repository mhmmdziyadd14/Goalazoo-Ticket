"use client";

import React, { useState, useEffect } from 'react';
import { createOrder, fetchEvents, fetchUsers, fetchTribunesByEvent } from '@/lib/api';
import { Order, Event, User, Tribune } from '@/app/types';
import {
  RiTicketLine,
  RiUserLine,
  RiCalendarEventLine,
  RiSteamLine, // Untuk ikon tribun
  RiNumber1, // Untuk ikon jumlah
  RiExchangeDollarLine, // Untuk ikon status pembayaran
  RiLoader4Line // Untuk loading spinner
} from 'react-icons/ri'; // Pastikan semua ikon diimpor

interface OrderFormProps {
  onOrderCreated: (order: Order) => void;
  showMessage?: (msg: string, type: 'success' | 'error') => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ onOrderCreated, showMessage }) => {
  const [formData, setFormData] = useState({
    userId: '',
    eventId: '',
    tribuneId: '',
    quantity: 1,
    status: 'pending' as 'pending' | 'paid' | 'cancelled'
  });
  const [events, setEvents] = useState<Event[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [tribunes, setTribunes] = useState<Tribune[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingTribunes, setLoadingTribunes] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedTribune, setSelectedTribune] = useState<Tribune | null>(null);

  useEffect(() => {
    const loadDependencies = async () => {
      try {
        const [fetchedEvents, fetchedUsers] = await Promise.all([
          fetchEvents(),
          fetchUsers()
        ]);
        setEvents(fetchedEvents);
        setUsers(fetchedUsers);
      } catch (error) {
        console.error('Error loading data:', error);
        showMessage?.('Gagal memuat data untuk form pesanan.', 'error');
      }
    };
    loadDependencies();
  }, [showMessage]); // showMessage sebagai dependency

  useEffect(() => {
    const loadTribunes = async () => {
      if (formData.eventId) {
        setLoadingTribunes(true);
        try {
          const fetchedTribunes = await fetchTribunesByEvent(parseInt(formData.eventId));
          setTribunes(fetchedTribunes);
          const event = events.find(e => e.id === parseInt(formData.eventId));
          setSelectedEvent(event || null);
          
          if (fetchedTribunes.length > 0) {
            setFormData(prev => ({ ...prev, tribuneId: fetchedTribunes[0].id.toString() }));
            setSelectedTribune(fetchedTribunes[0]);
          } else {
            setFormData(prev => ({ ...prev, tribuneId: '' }));
            setSelectedTribune(null);
          }
        } catch (error) {
          console.error('Error loading tribunes:', error);
          showMessage?.('Gagal memuat tribun untuk acara ini.', 'error');
          setTribunes([]);
          setSelectedTribune(null);
        } finally {
          setLoadingTribunes(false);
        }
      } else {
        setTribunes([]);
        setSelectedEvent(null);
        setSelectedTribune(null);
      }
    };
    loadTribunes();
  }, [formData.eventId, events, showMessage]); // Tambahkan events dan showMessage sebagai dependency

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'quantity' ? parseInt(value) : value })); // Konversi quantity ke int
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Periksa ulang selectedTribune
      if (!selectedTribune) {
        showMessage?.('Tribun tidak valid atau belum dipilih.', 'error');
        setLoading(false);
        return;
      }

      if (formData.quantity <= 0) {
        showMessage?.('Jumlah tiket harus lebih dari 0.', 'error');
        setLoading(false);
        return;
      }

      if (formData.quantity > selectedTribune.available_seats) {
        showMessage?.(`Jumlah tiket melebihi ketersediaan tribun. Tersedia: ${selectedTribune.available_seats}`, 'error');
        setLoading(false);
        return;
      }

      const newOrder: Omit<Order, 'id' | 'order_date' | 'booking_code'> = { // Tambahkan booking_code ke Omit
        user_id: parseInt(formData.userId),
        event_id: parseInt(formData.eventId),
        tribune_id: parseInt(formData.tribuneId),
        quantity: formData.quantity,
        total_price: formData.quantity * selectedTribune.price,
        status: formData.status,
      };

      const createdOrder = await createOrder(newOrder);
      onOrderCreated(createdOrder);
      showMessage?.('Pesanan berhasil dibuat!', 'success');

      // Reset form
      setFormData({
        userId: '',
        eventId: '',
        tribuneId: '',
        quantity: 1,
        status: 'pending'
      });
      setSelectedEvent(null);
      setSelectedTribune(null);
    } catch (error: any) {
      console.error('Failed to create order:', error);
      showMessage?.(error.message || 'Gagal membuat pesanan.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const isSubmitDisabled = loading || !formData.userId || !formData.eventId || !formData.tribuneId || formData.quantity <= 0 || !selectedTribune || formData.quantity > selectedTribune.available_seats;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
        <h3 className="text-2xl font-bold flex items-center">
          <RiTicketLine className="mr-3" />
          Buat Pesanan Baru
        </h3>
        <p className="text-blue-100 mt-1">Isi detail pesanan tiket pertandingan</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div>
          <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <RiUserLine className="mr-2" /> Pengguna
          </label>
          <select
            id="userId"
            name="userId"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-gray-900 placeholder-gray-700" // text-gray-900, placeholder-gray-700
            value={formData.userId}
            onChange={handleChange}
            required
          >
            <option value="">Pilih Pengguna</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.username || user.email} ({user.role})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="eventId" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <RiCalendarEventLine className="mr-2" /> Pertandingan
          </label>
          <select
            id="eventId"
            name="eventId"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-gray-900 placeholder-gray-700" // text-gray-900, placeholder-gray-700
            value={formData.eventId}
            onChange={handleChange}
            required
          >
            <option value="">Pilih Pertandingan</option>
            {events.map(event => (
              <option key={event.id} value={event.id}>
                {event.team1_name} vs {event.team2_name} ({event.category}) ({new Date(event.date).toLocaleDateString()})
              </option>
            ))}
          </select>
        </div>

        {selectedEvent && ( // Hanya tampilkan pilihan tribun jika event sudah dipilih
          <div>
            <label htmlFor="tribuneId" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <RiSteamLine className="mr-2" /> Tribun
            </label>
            {loadingTribunes ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                <span className="text-gray-600">Memuat tribun...</span>
              </div>
            ) : tribunes.length > 0 ? (
              <select
                id="tribuneId"
                name="tribuneId"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-gray-900" // text-gray-900
                value={formData.tribuneId}
                onChange={(e) => {
                  handleChange(e);
                  const tribune = tribunes.find(t => t.id === parseInt(e.target.value));
                  setSelectedTribune(tribune || null);
                }}
                required
              >
                {tribunes.map(tribune => (
                  <option key={tribune.id} value={tribune.id}>
                    {tribune.name} (Rp{parseFloat(tribune.price.toString()).toFixed(2).replace('.', ',')} - {tribune.available_seats} kursi tersedia)
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-red-500 text-sm">Tidak ada tribun tersedia untuk acara ini.</p>
            )}
          </div>
        )}

        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <RiNumber1 className="mr-2" /> Jumlah Tiket
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            min="1"
            max={selectedTribune?.available_seats || 1} // max disesuaikan
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-gray-900 placeholder-gray-700" // text-gray-900, placeholder-gray-700
            value={formData.quantity}
            onChange={handleChange}
            required
          />
          {selectedTribune && (
            <p className="text-sm text-gray-500 mt-1">
              Maksimal: {selectedTribune.available_seats} kursi tersedia
            </p>
          )}
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <RiExchangeDollarLine className="mr-2" /> Status Pembayaran
          </label>
          <select
            id="status"
            name="status"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-gray-900" // text-gray-900
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="pending">Pending</option>
            <option value="paid">Lunas</option>
            <option value="cancelled">Dibatalkan</option>
          </select>
        </div>

        {selectedTribune && formData.quantity > 0 && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Ringkasan Pesanan</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-gray-600">Harga per Tiket:</div>
              <div className="font-semibold text-right">
                Rp{parseFloat(selectedTribune.price.toString()).toFixed(2).replace('.', ',')}
              </div>
              <div className="text-gray-600">Jumlah Tiket:</div>
              <div className="text-right">{formData.quantity}</div>
              <div className="text-gray-600 font-bold">Total Harga:</div>
              <div className="font-bold text-right text-blue-700">
                Rp{(formData.quantity * selectedTribune.price).toFixed(2).replace('.', ',')}
              </div>
            </div>
          </div>
        )}

        <div className="pt-4">
          <button
            type="submit"
            className={`w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg shadow-md hover:from-blue-700 hover:to-blue-600 transition duration-300 ease-in-out flex items-center justify-center ${
              isSubmitDisabled ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            disabled={isSubmitDisabled}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Membuat...
              </>
            ) : (
              'Buat Pesanan'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrderForm;
