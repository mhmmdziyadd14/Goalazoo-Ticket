"use client";

import React, { useState } from 'react';
import { User, Order } from '@/app/types';
import UserEventList from '@/components/UserEventList';
import UserOrderList from '@/components/UserOrderList';
import UserDashboardPage from '@/components/UserDashboardPage'; // Import komponen UserDashboardPage
import Footer from '@/components/Footer'; // Import Footer

// Import ikon-ikon untuk sidebar
import { RiDashboardLine, RiTicketLine, RiListCheck2, RiLogoutBoxRLine, RiUser3Line } from 'react-icons/ri';

interface UserPageProps {
  user: User | null;
  handleLogout: () => void;
  showMessage: (msg: string, type: 'success' | 'error') => void;
  onInitiatePayment: (order: Order) => void;
}

const UserPage: React.FC<UserPageProps> = ({ user, handleLogout, showMessage, onInitiatePayment }) => {
  const [activeView, setActiveView] = useState<'dashboard' | 'events' | 'orders'>('dashboard');
  const [orderRefreshTrigger, setOrderRefreshTrigger] = useState(0);

  const handleOrderCreated = () => {
    setOrderRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col"> {/* Gunakan bg-gray-50 atau bg-gray-100 */}
      {/* Main Content Area */}
      <div className="flex flex-1 pt-16"> {/* pt-16 for padding from fixed navbar */}
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm p-4 flex flex-col border-r border-gray-200 fixed left-0 top-16 bottom-0 z-40">
          {/* User Profile Section (opsional, bisa ditampilkan di sini atau di navbar) */}

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto">
            <button
              onClick={() => setActiveView('dashboard')}
              className={`w-full flex items-center gap-3 text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeView === 'dashboard'
                  ? 'bg-blue-100 text-blue-700' // Warna aktif
                  : 'text-gray-700 hover:bg-gray-100' // Warna default/hover
              }`}
            >
              <RiDashboardLine className="text-lg" />
              Dashboard
            </button>

            <button
              onClick={() => setActiveView('events')}
              className={`w-full flex items-center gap-3 text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeView === 'events'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <RiTicketLine className="text-lg" />
              Acara Tersedia
            </button>

            <button
              onClick={() => setActiveView('orders')}
              className={`w-full flex items-center gap-3 text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeView === 'orders'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <RiListCheck2 className="text-lg" />
              Pesanan Saya
            </button>
          </nav>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="mt-auto w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-red-600 hover:bg-red-50 transition duration-300"
          >
            <RiLogoutBoxRLine className="text-lg" />
            Logout
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-6 bg-gray-50 flex flex-col items-center overflow-y-auto mt-16">
          <div className="w-full max-w-5xl"> {/* Gunakan max-w-5xl untuk menyesuaikan lebar */}
            {activeView === 'dashboard' && (
              <UserDashboardPage user={user} showMessage={showMessage} />
            )}

            {activeView === 'events' && (
              <div className="w-full"> {/* Pastikan kontainer list mengisi lebar */}
                <UserEventList
                  user={user}
                  showMessage={showMessage}
                  onInitiatePayment={onInitiatePayment}
                />
              </div>
            )}

            {activeView === 'orders' && (
              <div className="w-full"> {/* Pastikan kontainer list mengisi lebar */}
                <UserOrderList
                  user={user}
                  showMessage={showMessage}
                  refreshTrigger={orderRefreshTrigger}
                />
              </div>
            )}
          </div>
          {/* Footer di dalam main, agar posisinya relatif terhadap main content area */}
          <div className="w-full max-w-5xl mt-auto"> {/* Menambahkan max-w-5xl di sini */}
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserPage;
