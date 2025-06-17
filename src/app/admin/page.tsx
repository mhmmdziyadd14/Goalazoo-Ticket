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
import AdminDashboardPage from '@/components/AdminDashboardPage'; // Import komponen baru
import Footer from '@/components/Footer';

interface AdminPageProps {
  user: User | null;
  handleLogout: () => void;
  showMessage: (msg: string, type: 'success' | 'error') => void;
}

const AdminPage: React.FC<AdminPageProps> = ({ user, handleLogout, showMessage }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'events' | 'users' | 'orders' | 'categories'>('dashboard'); // Ubah default ke 'dashboard'

  const handleItemCreated = (item: Event | User | Order | Category) => {
    console.log('Item created/updated:', item);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navbar sudah dihandle di src/app/page.tsx */}
      <div className="flex flex-1">
        {/* Sidebar (posisi fixed di kiri) */}
        <aside className="w-64 bg-white shadow-lg p-4 flex flex-col border-r border-gray-200 fixed left-0 top-16 bottom-0 z-40">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Dashboard Admin</h3>
          <nav className="flex-1 space-y-2 overflow-y-auto">
            <button
              onClick={() => setActiveTab('dashboard')} // Tambahkan tombol Dashboard
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
          </nav>
          {/* Tombol Logout di sidebar */}
          <button
            onClick={handleLogout}
            className="mt-auto w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition duration-300 ease-in-out shadow-md"
          >
            Logout
          </button>
        </aside>

        {/* Area Konten Utama */}
        <main className="flex-1 ml-64 p-8 bg-gray-100 flex flex-col items-center overflow-y-auto mt-16">
          {/* Kontainer Card Utama */}
          <div className="w-full max-w-6xl bg-white p-8 rounded-xl shadow-lg border border-gray-200 text-center">
            {/* Hapus header Selamat Datang, Admin! jika sudah ada di AdminDashboardPage */}
            {/* <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Selamat Datang, Admin!</h2>
            <p className="text-lg text-gray-700 mb-6">Anda masuk sebagai: <span className="font-semibold">{user?.email}</span></p> */}

            {/* Konten berdasarkan tampilan sidebar aktif */}
            <div className="flex flex-col gap-8">
              {activeTab === 'dashboard' && ( // Tampilkan komponen Dashboard di sini
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
            </div>
          </div>
          {/* Footer di dalam main */}
          <div className="w-full max-w-6xl mt-auto">
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
