"use client";

import React, { useState } from 'react';
import { User, Event, Order, Category } from '@/app/types';
import EventForm from '@/components/EventForm';
import EventList from '@/components/EventList';
import UserForm from '@/components/UserForm';
import UserList from '@/components/UserList';
import OrderForm from '@/components/OrderForm';
import OrderList from '@/components/OrderList';
import CategoryForm from '@/components/CategoryForm';
import CategoryList from '@/components/CategoryList';
import AdminDashboardPage from '@/components/AdminDashboardPage';
import LeagueStandings from '@/components/LeagueStandings'; // Import komponen LeagueStandings
import Footer from '@/components/Footer';

// Import ikon-ikon untuk sidebar
import { RiDashboardLine, RiTicketLine, RiListCheck2, RiUserLine, RiPriceTag3Line, RiLogoutBoxRLine, RiFootballFill, RiFacebookFill, RiTwitterFill, RiInstagramLine, RiLinkedinFill, RiTableLine } from 'react-icons/ri'; // Tambahkan RiTableLine

interface AdminPageProps {
  user: User | null;
  handleLogout: () => void;
  showMessage: (msg: string, type: 'success' | 'error') => void;
}

const AdminPage: React.FC<AdminPageProps> = ({ user, handleLogout, showMessage }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'events' | 'users' | 'orders' | 'categories' | 'standings'>('dashboard'); // Tambahkan 'standings'

  const handleItemCreated = (item: Event | User | Order | Category) => {
    console.log('Item created/updated:', item);
  };

  return (
    <div className="flex flex-col flex-1">
      {/* Sidebar (posisi fixed di kiri) */}
      <aside className="w-64 bg-white shadow-sm p-4 flex flex-col border-r border-gray-200 fixed left-0 top-16 bottom-0 z-40">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Dashboard Admin</h3>
        <nav className="flex-1 space-y-2 overflow-y-auto">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full text-left px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`w-full text-left px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${activeTab === 'events' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            Kelola Acara
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`w-full text-left px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${activeTab === 'users' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            Kelola Pengguna
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full text-left px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${activeTab === 'orders' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            Kelola Pesanan
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`w-full text-left px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${activeTab === 'categories' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            Kelola Kategori
          </button>
          <button
            onClick={() => setActiveTab('standings')}
            className={`w-full flex items-center gap-3 text-left px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${activeTab === 'standings' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <RiTableLine className="text-lg" />
            Klasemen Liga
          </button>
        </nav>
        {/* Tombol Logout di sidebar */}
        <button
          onClick={handleLogout}
          className="mt-auto w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition duration-300 ease-in-out shadow-md"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-6 bg-gray-50 flex flex-col overflow-y-auto">
        <div className="w-full max-w-6xl mx-auto">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Selamat Datang, Admin!</h2>
          <p className="text-lg text-gray-700 mb-6">Anda masuk sebagai: <span className="font-semibold">{user?.email}</span></p>

          <div className="flex flex-col gap-8">
            {activeTab === 'dashboard' && (
              <AdminDashboardPage user={user} showMessage={showMessage} />
            )}

            {activeTab === 'events' && (
              <>
                <EventList showMessage={showMessage} />
                <EventForm onEventCreated={handleItemCreated} showMessage={showMessage} />
              </>
            )}

            {activeTab === 'users' && (
              <>
                <UserList showMessage={showMessage} />
                <UserForm onUserCreated={handleItemCreated} showMessage={showMessage} />
              </>
            )}

            {activeTab === 'orders' && (
              <>
                <OrderList showMessage={showMessage} />
                <OrderForm onOrderCreated={handleItemCreated} showMessage={showMessage} />
              </>
            )}

            {activeTab === 'categories' && (
              <>
                <CategoryList showMessage={showMessage} />
                <CategoryForm onCategoryCreated={handleItemCreated} showMessage={showMessage} />
              </>
            )}

            {activeTab === 'standings' && ( /* Render LeagueStandings di sini */
              <LeagueStandings showMessage={showMessage} />
            )}
          </div>
        </div>

        {/* Footer di dalam main, tetapi di luar div konten utama agar selalu di bawah */}
        <div className="w-full max-w-6xl mx-auto mt-8">
          <Footer />
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
