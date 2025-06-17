"use client";

import React, { useState, useEffect } from 'react';
import { User, Event, Order, Tribune, Category } from '@/app/types';
import { fetchOrders, fetchEvents, fetchUsers, fetchTribunesByEvent, fetchCategories } from '@/lib/api';
import { RiTicket2Line, RiCalendarLine, RiMapPinLine, RiTeamLine, RiCouponLine, RiDownloadLine, RiCloseLine, RiLoader4Line, RiErrorWarningLine } from 'react-icons/ri';
import ETicket from '@/components/ETicket';

interface UserOrderListProps {
  user: User | null;
  showMessage: (msg: string, type: 'success' | 'error') => void;
  refreshTrigger: number;
}

const UserOrderList: React.FC<UserOrderListProps> = ({ user, showMessage, refreshTrigger }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [tribunes, setTribunes] = useState<Tribune[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingOrders, setLoadingOrders] = useState<boolean>(true);
  const [selectedOrderForTicket, setSelectedOrderForTicket] = useState<Order | null>(null);

  const loadOrders = async () => {
    setLoadingOrders(true);
    try {
      if (user?.id) {
        const [allOrders, eventsData, usersData, categoriesData] = await Promise.all([
          fetchOrders(),
          fetchEvents(),
          fetchUsers(),
          fetchCategories()
        ]);

        // Fetch tribunes for all events in parallel
        const tribunesPromises = eventsData.map(event => 
          fetchTribunesByEvent(event.id).catch(error => {
            console.warn(`Could not fetch tribunes for event ${event.id}:`, error);
            return [];
          })
        );
        const allTribunes = (await Promise.all(tribunesPromises)).flat();

        setTribunes(allTribunes);
        setOrders(allOrders.filter(order => order.user_id === user.id));
        setEvents(eventsData);
        setUsers(usersData);
        setCategories(categoriesData);
      } else {
        setOrders([]);
      }
    } catch (error: any) {
      showMessage(error.message || 'Gagal memuat pesanan Anda.', 'error');
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [user?.id, refreshTrigger]);

  const getEventName = (eventId: number) => {
    const event = events.find(e => e.id === eventId);
    return event ? `${event.team1_name} vs ${event.team2_name} (${getCategoryName(event.category_id)})` : 'Acara Tidak Dikenal';
  };

  const getEventById = (eventId: number) => {
    return events.find(e => e.id === eventId);
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Tidak Dikenal';
  };

  const getTribuneById = (tribuneId?: number) => {
    if (!tribuneId) return undefined;
    return tribunes.find(t => t.id === tribuneId);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleViewETicket = (order: Order) => {
    const eventDetail = getEventById(order.event_id);
    const tribuneDetail = getTribuneById(order.tribune_id);

    if (eventDetail && tribuneDetail && user) {
      setSelectedOrderForTicket(order);
    } else {
      showMessage('Detail e-tiket tidak lengkap.', 'error');
    }
  };

  const handleCloseETicket = () => {
    setSelectedOrderForTicket(null);
  };

  if (loadingOrders) {
    return (
      <div className="flex justify-center items-center h-64">
        <RiLoader4Line className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  if (selectedOrderForTicket) {
    const eventDetail = getEventById(selectedOrderForTicket.event_id);
    const tribuneDetail = getTribuneById(selectedOrderForTicket.tribune_id);

    if (eventDetail && tribuneDetail && user) {
      return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl relative max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <button
              onClick={handleCloseETicket}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 p-1 rounded-full transition"
              aria-label="Tutup E-tiket"
            >
              <RiCloseLine className="w-6 h-6" />
            </button>
            <ETicket 
              order={selectedOrderForTicket} 
              event={eventDetail} 
              tribune={tribuneDetail} 
              user={user} 
            />
          </div>
        </div>
      );
    } else {
      showMessage('Gagal menampilkan e-tiket: data tidak lengkap.', 'error');
      setSelectedOrderForTicket(null);
      return null;
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <RiTicket2Line className="text-2xl text-blue-600" />
        <h3 className="text-2xl font-bold text-gray-800">Pesanan Saya</h3>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <RiErrorWarningLine className="mx-auto text-3xl mb-2" />
          Anda belum memiliki pesanan.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {orders.map((order) => {
            const eventDetail = getEventById(order.event_id);
            const tribuneDetail = getTribuneById(order.tribune_id);

            return (
              <div key={order.id} className="bg-gray-50 p-5 rounded-xl border border-gray-200 hover:shadow-sm transition-shadow">
                {/* Match Information */}
                <div className="flex items-center justify-center gap-3 mb-4">
                  {/* Team 1 */}
                  <div className="flex-1 flex items-center justify-end gap-2">
                    <span className="font-bold text-gray-800 text-right">
                      {eventDetail?.team1_name || 'Tim Tidak Dikenal'}
                    </span>
                    {eventDetail?.team1_logo_url && (
                      <img 
                        src={eventDetail.team1_logo_url} 
                        alt="Team 1 Logo" 
                        className="w-10 h-10 object-contain"
                        onError={(e) => (e.currentTarget.src = 'https://placehold.co/40x40/cccccc/white?text=T1')} 
                      />
                    )}
                  </div>

                  {/* VS Separator */}
                  <div className="px-2 text-gray-500">
                    <RiTeamLine />
                  </div>

                  {/* Team 2 */}
                  <div className="flex-1 flex items-center gap-2">
                    {eventDetail?.team2_logo_url && (
                      <img 
                        src={eventDetail.team2_logo_url} 
                        alt="Team 2 Logo" 
                        className="w-10 h-10 object-contain"
                        onError={(e) => (e.currentTarget.src = 'https://placehold.co/40x40/cccccc/white?text=T2')} 
                      />
                    )}
                    <span className="font-bold text-gray-800">
                      {eventDetail?.team2_name || 'Tim Tidak Dikenal'}
                    </span>
                  </div>
                </div>

                {/* Event Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <RiCalendarLine />
                    <span>
                      {eventDetail?.date 
                        ? new Date(eventDetail.date).toLocaleDateString('id-ID', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : 'Tanggal tidak diketahui'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <RiMapPinLine />
                    <span>{eventDetail?.location || 'Lokasi tidak diketahui'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <RiCouponLine />
                    <span>
                      {tribuneDetail?.name || 'Tribun tidak diketahui'} • {order.quantity} tiket
                    </span>
                  </div>
                </div>

                {/* Price and Status */}
                <div className="flex justify-between items-center border-t border-gray-200 pt-3">
                  <div className="text-lg font-bold text-blue-600">
                    {formatPrice(order.total_price)}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === 'paid' 
                        ? 'bg-green-100 text-green-800' 
                        : order.status === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {order.status.toUpperCase()}
                    </span>
                    {order.status === 'paid' && (
                      <button
                        onClick={() => handleViewETicket(order)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-1 transition"
                      >
                        <RiDownloadLine />
                        E-tiket
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserOrderList;