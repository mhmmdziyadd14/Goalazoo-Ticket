"use client";

import React, { useState, useEffect } from 'react';
import { User, Order } from '@/app/types'; // Import Order type for statistics
import { fetchOrders } from '@/lib/api'; // Import fetchOrders to get order statistics

interface UserDashboardPageProps {
  user: User | null;
  showMessage: (msg: string, type: 'success' | 'error') => void;
}

const UserDashboardPage: React.FC<UserDashboardPageProps> = ({ user, showMessage }) => {
  const [totalOrders, setTotalOrders] = useState(0);
  const [activeOrders, setActiveOrders] = useState(0);
  const [completedOrders, setCompletedOrders] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const loadOrderStats = async () => {
      if (!user?.id) {
        setLoadingStats(false);
        return;
      }
      setLoadingStats(true);
      try {
        const allOrders: Order[] = await fetchOrders();
        const userOrders = allOrders.filter(order => order.user_id === user.id);

        setTotalOrders(userOrders.length);
        setActiveOrders(userOrders.filter(order => order.status === 'pending').length);
        setCompletedOrders(userOrders.filter(order => order.status === 'paid').length);

      } catch (error: any) {
        console.error('Error loading order statistics:', error);
        showMessage(error.message || 'Gagal memuat statistik pesanan.', 'error');
      } finally {
        setLoadingStats(false);
      }
    };
    loadOrderStats();
  }, [user?.id, showMessage]);


  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 text-left w-full">
      <h3 className="text-3xl font-extrabold text-gray-900 mb-2">Dashboard Pengguna</h3>
      <p className="text-gray-600 mb-6">Ringkasan aktivitas dan informasi akun Anda</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Informasi Akun */}
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <div className="flex items-center text-blue-800 font-semibold mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Informasi Akun</span>
          </div>
          <p className="text-gray-800">Nama: <span className="font-medium">{user?.username || 'Tidak Diketahui'}</span></p>
          <p className="text-gray-800">Email: <span className="font-medium">{user?.email || 'Tidak Diketahui'}</span></p>
          <p className="text-gray-800">Role: <span className="font-medium">{user?.role || 'Tidak Diketahui'}</span></p>
        </div>

        {/* Statistik Pesanan */}
        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <div className="flex items-center text-green-800 font-semibold mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>Statistik Pesanan</span>
          </div>
          {loadingStats ? (
            <p className="text-gray-700">Memuat statistik...</p>
          ) : (
            <>
              <p className="text-gray-800">Total Pesanan: <span className="font-medium">{totalOrders}</span></p>
              <p className="text-gray-800">Pesanan Aktif (Pending): <span className="font-medium">{activeOrders}</span></p>
              <p className="text-gray-800">Pesanan Selesai (Paid): <span className="font-medium">{completedOrders}</span></p>
            </>
          )}
        </div>
      </div>

      {/* Panduan Penggunaan */}
      <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
        <div className="flex items-center text-yellow-800 font-semibold mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.202 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.523 5.798 19 7.5 19s3.332-.477 4.5-1.253m0 0V5c-1.274 4.057-5.065 7-9.542 7C3.732 12 0 12 0 12v-.253c1.274 4.057 5.065 7 9.542 7C13.268 19 17.059 16.057 18.333 12m0 0V5c1.274 4.057 5.065 7 9.542 7C22.268 12 26 12 26 12v-.253c-1.274-4.057-5.065-7-9.542-7C13.732 5 9.941 5.477 8.667 6.253" />
          </svg>
          <span>Panduan Penggunaan</span>
        </div>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>Gunakan menu navigasi di sebelah kiri untuk berpindah halaman.</li>
          <li>Di halaman "Acara Tersedia" Anda bisa melihat dan membeli tiket.</li>
          <li>Di halaman "Pesanan Saya" Anda bisa melihat riwayat pembelian dan mengunduh e-tiket.</li>
          <li>Pastikan email Anda aktif untuk menerima e-tiket.</li>
        </ul>
      </div>
    </div>
  );
};

export default UserDashboardPage;
