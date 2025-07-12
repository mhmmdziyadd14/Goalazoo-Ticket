"use client";

import React, { useState, useEffect } from 'react';
import { User } from '@/app/types';
import { fetchAdminStats } from '@/lib/api';
import LeagueStandings from '@/components/LeagueStandings'; // Import komponen baru
import { RiFileListLine, RiUserLine, RiShoppingCartLine, RiPriceTag3Line, RiDashboardLine, RiInformationLine, RiLoader5Fill, RiTableLine } from 'react-icons/ri'; // Tambahkan RiTableLine

interface AdminDashboardPageProps {
  user: User | null;
  showMessage: (msg: string, type: 'success' | 'error') => void;
}

const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ user, showMessage }) => {
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalCategories: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setLoadingStats(true);
      try {
        const adminStats = await fetchAdminStats();
        setStats(adminStats);
      } catch (error: any) {
        console.error('Error loading admin dashboard stats:', error);
        showMessage(error.message || 'Gagal memuat statistik dashboard admin.', 'error');
      } finally {
        setLoadingStats(false);
      }
    };
    loadStats();
  }, [showMessage]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 text-left w-full">
      <h3 className="text-3xl font-extrabold text-gray-900 mb-2">Dashboard Admin</h3>
      <p className="text-gray-600 mb-6">Ringkasan cepat aktivitas sistem dan data utama.</p>

      {loadingStats ? (
        <div className="flex justify-center items-center py-16">
          <RiLoader5Fill className="animate-spin text-4xl text-blue-600" />
          <p className="text-gray-700 ml-3">Memuat statistik...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Card Total Events */}
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 flex items-center space-x-4 shadow-sm">
            <div className="p-3 bg-blue-200 rounded-full text-blue-800">
              <RiFileListLine className="h-6 w-6" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Events</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalEvents}</p>
            </div>
          </div>

          {/* Card Total Users */}
          <div className="bg-green-50 p-6 rounded-lg border border-green-200 flex items-center space-x-4 shadow-sm">
            <div className="p-3 bg-green-200 rounded-full text-green-800">
              <RiUserLine className="h-6 w-6" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
          </div>

          {/* Card Total Orders */}
          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200 flex items-center space-x-4 shadow-sm">
            <div className="p-3 bg-purple-200 rounded-full text-purple-800">
              <RiShoppingCartLine className="h-6 w-6" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
            </div>
          </div>

          {/* Card Total Categories */}
          <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200 flex items-center space-x-4 shadow-sm">
            <div className="p-3 bg-yellow-200 rounded-full text-yellow-800">
              <RiPriceTag3Line className="h-6 w-6" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Categories</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCategories}</p>
            </div>
          </div>
        </div>
      )}

      {/* Informasi Admin Section (contoh) */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <RiInformationLine /> Informasi Admin
        </h3>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>Nama Admin: <span className="font-medium">{user?.username || 'Tidak Diketahui'}</span></li>
          <li>Email Admin: <span className="font-medium">{user?.email || 'Tidak Diketahui'}</span></li>
          <li>Peran: <span className="font-medium">{user?.role || 'Tidak Diketahui'}</span></li>
        </ul>
      </div>

      {/* Bagian Klasemen Liga */}
      <div className="w-full">
        <LeagueStandings showMessage={showMessage} />
      </div>
    </div>
  );
};

export default AdminDashboardPage;
