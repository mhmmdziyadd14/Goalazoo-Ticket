"use client";

import React from 'react';
import { Order, Event, Tribune, User } from '@/app/types';
import { RiTicket2Line, RiCalendarLine, RiMapPinLine, RiTeamLine, RiUserLine, RiMailLine, RiMoneyDollarCircleLine, RiInformationLine } from 'react-icons/ri';

interface ETicketProps {
  order: Order;
  event: Event;
  tribune: Tribune;
  user: User;
}

const ETicket: React.FC<ETicketProps> = ({ order, event, tribune, user }) => {
  // Format price with proper IDR formatting
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Generate QR code data
  const qrCodeData = JSON.stringify({
    booking_code: order.booking_code,
    order_id: order.id,
    event: `${event.team1_name} vs ${event.team2_name}`,
    tribune: tribune.name,
    user_email: user.email,
    total_price: order.total_price,
  });

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl border border-gray-200 max-w-2xl mx-auto my-4">
      {/* Ticket Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <RiTicket2Line className="text-3xl text-blue-600" />
          <h2 className="text-3xl font-extrabold text-blue-700">E-TIKET PERTANDINGAN</h2>
        </div>
        <div className="bg-blue-600 text-white py-2 px-4 rounded-lg inline-block">
          <p className="font-bold tracking-wider">{order.booking_code}</p>
        </div>
      </div>

      {/* Match Information */}
      <div className="mb-8 border-b border-gray-200 pb-6">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
          {/* Team 1 */}
          <div className="flex-1 flex flex-col items-center">
            {event.team1_logo_url && (
              <img 
                src={event.team1_logo_url} 
                alt={`${event.team1_name} Logo`} 
                className="w-24 h-24 object-contain mb-2"
                onError={(e) => (e.currentTarget.src = 'https://placehold.co/96x96/cccccc/white?text=Logo')} 
              />
            )}
            <h3 className="text-2xl font-bold text-gray-800 text-center">{event.team1_name}</h3>
          </div>

          {/* VS Separator */}
          <div className="flex items-center justify-center">
            <div className="bg-gray-200 rounded-full p-2">
              <RiTeamLine className="text-gray-600 text-xl" />
            </div>
          </div>

          {/* Team 2 */}
          <div className="flex-1 flex flex-col items-center">
            {event.team2_logo_url && (
              <img 
                src={event.team2_logo_url} 
                alt={`${event.team2_name} Logo`} 
                className="w-24 h-24 object-contain mb-2"
                onError={(e) => (e.currentTarget.src = 'https://placehold.co/96x96/cccccc/white?text=Logo')} 
              />
            )}
            <h3 className="text-2xl font-bold text-gray-800 text-center">{event.team2_name}</h3>
          </div>
        </div>

        {/* Event Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="flex items-center gap-3">
            <RiCalendarLine className="text-gray-500 text-xl" />
            <div>
              <p className="text-sm text-gray-500">Tanggal & Waktu</p>
              <p className="font-medium">
                {new Date(event.date).toLocaleDateString('id-ID', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}, {new Date(event.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <RiMapPinLine className="text-gray-500 text-xl" />
            <div>
              <p className="text-sm text-gray-500">Lokasi</p>
              <p className="font-medium">{event.location}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Ticket Details */}
      <div className="mb-8 border-b border-gray-200 pb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <RiTicket2Line className="text-blue-500" />
          Detail Tiket
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Tribun</h4>
            <p className="text-lg font-bold text-blue-600">{tribune.name}</p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Jumlah Tiket</h4>
            <p className="text-lg font-bold">{order.quantity}</p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Harga per Tiket</h4>
            <p className="text-lg font-bold text-green-600">{formatPrice(tribune.price)}</p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Total Pembayaran</h4>
            <p className="text-xl font-extrabold text-blue-600">{formatPrice(order.total_price)}</p>
          </div>
        </div>
      </div>

      {/* QR Code Section */}
      <div className="mb-8">
        <div className="flex flex-col items-center">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrCodeData)}`}
            alt="QR Code Tiket"
            className="w-48 h-48 object-contain border-4 border-blue-100 rounded-lg shadow-md mb-4"
            onError={(e) => { e.currentTarget.src = 'https://placehold.co/200x200/cccccc/white?text=QR+Code'; }}
          />
          <p className="text-sm text-gray-600 text-center max-w-xs">
            Tunjukkan QR code ini di pintu masuk untuk memvalidasi tiket Anda
          </p>
        </div>
      </div>

      {/* User Information */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <RiUserLine className="text-blue-500" />
          Informasi Pemesan
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <RiUserLine className="text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Nama Pengguna</p>
              <p className="font-medium">{user.username}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <RiMailLine className="text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <RiCalendarLine className="text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Tanggal Pesanan</p>
              <p className="font-medium">
                {new Date(order.order_date || '').toLocaleDateString('id-ID', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <RiMoneyDollarCircleLine className="text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Status Pembayaran</p>
              <p className="font-medium capitalize">{order.status}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Important Notes */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
        <div className="flex items-start gap-3">
          <RiInformationLine className="text-blue-600 text-xl mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-blue-800 mb-2">Informasi Penting</h4>
            <ul className="list-disc list-inside space-y-1 text-blue-700">
              <li>Tiket ini hanya berlaku untuk pertandingan yang tertera</li>
              <li>Tidak dapat diuangkan kembali atau ditukar</li>
              <li>Harap tiba minimal 30 menit sebelum pertandingan dimulai</li>
              <li>Dilarang membawa senjata tajam atau bahan berbahaya</li>
              <li>Tunjukkan QR code dan identitas yang valid saat masuk</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ETicket;