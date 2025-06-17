"use client";

import React, { useState, useEffect } from 'react';
import { User, Event, Order, Tribune, Category } from '@/app/types';
import { fetchEvents, createOrder, fetchTribunesByEvent, fetchCategories } from '@/lib/api';
import { RiTicket2Line, RiCalendarLine, RiMapPinLine, RiArrowLeftRightLine, RiCloseLine, RiLoader4Line, RiErrorWarningLine, RiCheckLine } from 'react-icons/ri';

interface UserEventListProps {
  user: User | null;
  showMessage: (msg: string, type: 'success' | 'error') => void;
  onInitiatePayment: (order: Order) => void;
}

const UserEventList: React.FC<UserEventListProps> = ({ user, showMessage, onInitiatePayment }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingEvents, setLoadingEvents] = useState<boolean>(true);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
  const [selectedTribuneId, setSelectedTribuneId] = useState<number | null>(null);
  const [tribunesForEvent, setTribunesForEvent] = useState<Tribune[]>([]);
  const [loadingTribunes, setLoadingTribunes] = useState<boolean>(false);
  const [showTribuneSelectForEvent, setShowTribuneSelectForEvent] = useState<number | null>(null);

  const loadEvents = async () => {
    setLoadingEvents(true);
    try {
      const data = await fetchEvents();
      setEvents(data);
    } catch (error: any) {
      showMessage(error.message || 'Gagal memuat acara.', 'error');
    } finally {
      setLoadingEvents(false);
    }
  };

  const loadCategories = async () => {
    setLoadingCategories(true);
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (error: any) {
      showMessage(error.message || 'Gagal memuat kategori.', 'error');
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    loadEvents();
    loadCategories();
  }, []);

  const handleSelectEventForTribune = async (eventId: number) => {
    setShowTribuneSelectForEvent(eventId);
    setSelectedTribuneId(null);
    setLoadingTribunes(true);
    try {
      const tribunesData = await fetchTribunesByEvent(eventId);
      setTribunesForEvent(tribunesData);
      if (tribunesData.length > 0) {
        setSelectedTribuneId(tribunesData[0].id);
      } else {
        setSelectedTribuneId(null);
      }
    } catch (error: any) {
      showMessage(error.message || 'Gagal memuat tribun untuk acara ini.', 'error');
      setTribunesForEvent([]);
      setSelectedTribuneId(null);
    } finally {
      setLoadingTribunes(false);
    }
  };

  const handleOrderEvent = async (eventId: number) => {
    if (!user?.id) {
      showMessage('Anda harus login untuk memesan tiket.', 'error');
      return;
    }
    if (selectedTribuneId === null) {
      showMessage('Silakan pilih tribun terlebih dahulu.', 'error');
      return;
    }

    const selectedTribune = tribunesForEvent.find(t => t.id === selectedTribuneId);
    if (!selectedTribune) {
      showMessage('Tribun yang dipilih tidak valid.', 'error');
      return;
    }

    if (selectedTribune.available_seats <= 0) {
      showMessage('Tiket untuk tribun ini sudah habis.', 'error');
      return;
    }

    const quantity = 1;

    try {
      const newOrderData: Omit<Order, 'id' | 'order_date'> = {
        user_id: user.id,
        event_id: eventId,
        tribune_id: selectedTribuneId,
        quantity: quantity,
        total_price: selectedTribune.price * quantity,
        status: 'pending',
      };
      const createdOrder = await createOrder(newOrderData);
      showMessage('Pesanan berhasil dibuat! Arahkan ke pembayaran.', 'success');
      
      onInitiatePayment(createdOrder);

      setShowTribuneSelectForEvent(null);
      setSelectedTribuneId(null);
      loadEvents();
    } catch (error: any) {
      console.error('Error ordering event:', error);
      showMessage(error.message || 'Gagal membuat pesanan.', 'error');
    }
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Tidak Dikenal';
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loadingEvents || loadingCategories) {
    return (
      <div className="flex justify-center items-center h-64">
        <RiLoader4Line className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex items-center gap-2 mb-6">
        <RiTicket2Line className="text-2xl text-blue-600" />
        <h3 className="text-2xl font-bold text-gray-800">Acara Tersedia</h3>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <RiErrorWarningLine className="mx-auto text-3xl mb-2" />
          Tidak ada acara yang tersedia saat ini.
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              {/* Match Information */}
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                {/* Team 1 */}
                <div className="flex-1 flex items-center justify-end gap-3">
                  <span className="font-bold text-lg text-gray-900 text-right">{event.team1_name}</span>
                  {event.team1_logo_url && (
                    <img 
                      src={event.team1_logo_url} 
                      alt={`${event.team1_name} Logo`} 
                      className="w-12 h-12 object-contain"
                      onError={(e) => (e.currentTarget.src = 'https://placehold.co/48x48/cccccc/white?text=No+Logo')} 
                    />
                  )}
                </div>

                {/* VS Separator */}
                <div className="flex items-center justify-center">
                  <div className="bg-gray-200 rounded-full p-2">
                    <RiArrowLeftRightLine className="text-gray-600" />
                  </div>
                </div>

                {/* Team 2 */}
                <div className="flex-1 flex items-center gap-3">
                  {event.team2_logo_url && (
                    <img 
                      src={event.team2_logo_url} 
                      alt={`${event.team2_name} Logo`} 
                      className="w-12 h-12 object-contain"
                      onError={(e) => (e.currentTarget.src = 'https://placehold.co/48x48/cccccc/white?text=No+Logo')} 
                    />
                  )}
                  <span className="font-bold text-lg text-gray-900">{event.team2_name}</span>
                </div>
              </div>

              {/* Event Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <RiCalendarLine />
                  <span>{new Date(event.date).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <RiMapPinLine />
                  <span>{event.location}</span>
                </div>
                <div className="md:col-span-2 text-gray-700">
                  <span className="font-medium">Kategori:</span> {getCategoryName(event.category_id)}
                </div>
                {event.description && (
                  <div className="md:col-span-2 text-gray-700">
                    {event.description}
                  </div>
                )}
              </div>

              {/* Tribune Selection */}
              {showTribuneSelectForEvent === event.id ? (
                <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-800">Pilih Tribun</h4>
                    <button 
                      onClick={() => setShowTribuneSelectForEvent(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <RiCloseLine />
                    </button>
                  </div>

                  {loadingTribunes ? (
                    <div className="flex justify-center py-4">
                      <RiLoader4Line className="animate-spin text-blue-600" />
                    </div>
                  ) : tribunesForEvent.length > 0 ? (
                    <div className="space-y-3">
                      <select
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={selectedTribuneId !== null ? selectedTribuneId : ''}
                        onChange={(e) => setSelectedTribuneId(parseInt(e.target.value))}
                      >
                        {tribunesForEvent.map(tribune => (
                          <option key={tribune.id} value={tribune.id}>
                            {tribune.name} - {formatPrice(tribune.price)} ({tribune.available_seats} kursi tersedia)
                          </option>
                        ))}
                      </select>

                      <div className="flex gap-3">
                        <button
                          onClick={() => handleOrderEvent(event.id)}
                          disabled={
                            !selectedTribuneId || 
                            !tribunesForEvent.find(t => t.id === selectedTribuneId)?.available_seats
                          }
                          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium transition ${
                            !selectedTribuneId || 
                            !tribunesForEvent.find(t => t.id === selectedTribuneId)?.available_seats
                              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                              : 'bg-green-600 text-white hover:bg-green-700'
                          }`}
                        >
                          <RiCheckLine />
                          Pesan Tiket
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-red-500">
                      <RiErrorWarningLine className="mx-auto mb-1" />
                      Tidak ada tribun tersedia untuk acara ini.
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => handleSelectEventForTribune(event.id)}
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition flex items-center justify-center gap-2"
                >
                  <RiTicket2Line />
                  Pilih Tribun
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserEventList;