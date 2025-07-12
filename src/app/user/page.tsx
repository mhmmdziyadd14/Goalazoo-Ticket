"use client";

import React, { useState } from 'react';
import { User, Order } from '@/app/types';
import UserEventList from '@/components/UserEventList';
import UserOrderList from '@/components/UserOrderList';
import UserDashboardPage from '@/components/UserDashboardPage';
import LeagueStandings from '@/components/LeagueStandings'; // Import komponen LeagueStandings
// import Footer from '@/components/Footer'; // Hapus import Footer component karena akan di-inline

// Import ikon-ikon untuk sidebar dan footer
import { RiDashboardLine, RiTicketLine, RiListCheck2, RiLogoutBoxRLine, RiUser3Line, RiFootballFill, RiFacebookFill, RiTwitterFill, RiInstagramLine, RiLinkedinFill, RiTableLine } from 'react-icons/ri';

interface UserPageProps {
  user: User | null;
  handleLogout: () => void;
  showMessage: (msg: string, type: 'success' | 'error') => void;
  onInitiatePayment: (order: Order) => void;
}

const UserPage: React.FC<UserPageProps> = ({ user, handleLogout, showMessage, onInitiatePayment }) => {
  const [activeView, setActiveView] = useState<'dashboard' | 'events' | 'orders' | 'standings'>('dashboard');
  const [orderRefreshTrigger, setOrderRefreshTrigger] = useState(0);

  const handleOrderCreated = () => {
    setOrderRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="flex flex-col flex-1">
      {/* Sidebar (posisi fixed di kiri) */}
      <aside className="w-64 bg-white shadow-sm p-4 flex flex-col border-r border-gray-200 fixed left-0 top-16 bottom-0 z-40">
        {/* User Profile Section */}
        <div className="text-center pb-4 mb-4 border-b border-gray-200">
          <div className="mx-auto bg-gray-200 rounded-full h-16 w-16 flex items-center justify-center text-gray-500 text-3xl font-bold">
            {user?.username ? user.username.charAt(0).toUpperCase() : <RiUser3Line />}
          </div>
          <p className="mt-2 text-gray-800 font-semibold">{user?.username || 'Pengguna'}</p>
          <p className="text-gray-600 text-sm">{user?.email}</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto">
          <button
            onClick={() => setActiveView('dashboard')}
            className={`w-full flex items-center gap-3 text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeView === 'dashboard'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
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
          <button
            onClick={() => setActiveView('standings')}
            className={`w-full flex items-center gap-3 text-left px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${activeView === 'standings' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <RiTableLine className="text-lg" />
            Klasemen Liga
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
      <main className="flex-1 ml-64 p-6 bg-gray-50 flex flex-col overflow-y-auto">
        {/* Kontainer untuk Header dan Konten Tab */}
        <div className="w-full max-w-4xl mx-auto"> {/* max-w-4xl mx-auto untuk memusatkan konten */}
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Selamat Datang, Pengguna!</h2>
          <p className="text-lg text-gray-700 mb-6">Anda masuk sebagai: <span className="font-semibold">{user?.email}</span></p>

          <div className="grid grid-cols-1 gap-8">
            {activeView === 'dashboard' && (
              <UserDashboardPage user={user} showMessage={showMessage} />
            )}

            {activeView === 'events' && (
              <div className="w-full">
                <UserEventList user={user} showMessage={showMessage} onInitiatePayment={onInitiatePayment} />
              </div>
            )}

            {activeView === 'orders' && (
              <div className="w-full">
                <UserOrderList user={user} showMessage={showMessage} refreshTrigger={orderRefreshTrigger} />
              </div>
            )}

            {activeView === 'standings' && (
              <LeagueStandings showMessage={showMessage} />
            )}
          </div>
        </div>
        
        {/* Footer dimasukkan di sini, di luar div konten utama, tetapi masih di dalam <main> */}
        {/* Menggunakan max-w-4xl mx-auto agar footer selaras dengan konten di atasnya */}
        <footer className="w-full bg-blue-900 py-8 px-4 text-white text-sm mt-8">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left space-y-4 md:space-y-0">
            {/* Goalazoo Brand Section */}
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center space-x-2 mb-2">
                <div className="p-2 bg-blue-700 rounded-lg shadow-md">
                  <RiFootballFill className="h-6 w-6 text-yellow-400" />
                </div>
                <span className="text-2xl font-bold tracking-tight">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-400">
                    Goalazoo
                  </span>
                  <span className="text-blue-200">.</span>
                </span>
              </div>
              <p className="text-blue-200 text-xs max-w-sm">
                Platform tiket pertandingan sepakbola terbaik di Indonesia. Temukan dan pesan tiket acara favorit Anda dengan mudah.
              </p>
            </div>

            {/* Quick Links */}
            <div className="flex flex-col items-center md:items-start">
              <h4 className="font-semibold text-lg mb-2 text-yellow-400">Tautan Cepat</h4>
              <ul className="space-y-1 text-blue-200">
                <li><a href="#" className="hover:text-white transition-colors">Beranda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pertandingan</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tentang Kami</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Kontak</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="flex flex-col items-center md:items-start">
              <h4 className="font-semibold text-lg mb-2 text-yellow-400">Kontak Kami</h4>
              <p className="text-blue-200">Email: info@goalazoo.com</p>
              <p className="text-blue-200">Telepon: +62 123 4567 890</p>
              <p className="text-blue-200">Alamat: Jakarta, Indonesia</p>
            </div>

            {/* Social Media */}
            <div className="flex flex-col items-center md:items-start">
              <h4 className="font-semibold text-lg mb-2 text-yellow-400">Media Sosial</h4>
              <div className="flex space-x-3 text-blue-200 text-2xl">
                <a href="#" className="hover:text-white transition-colors"><RiFacebookFill /></a>
                <a href="#" className="hover:text-white transition-colors"><RiTwitterFill /></a>
                <a href="#" className="hover:text-white transition-colors"><RiInstagramLine /></a>
                <a href="#" className="hover:text-white transition-colors"><RiLinkedinFill /></a>
              </div>
            </div>
          </div>
          <div className="border-t border-blue-700 mt-8 pt-4 text-center text-blue-300">
            <p>&copy; 2025 Goalazoo. All Rights Reserved.</p>
            <div className="flex justify-center space-x-4 mt-2 text-xs">
              <a href="#" className="hover:underline text-blue-400">Terms of Service</a>
              <a href="#" className="hover:underline text-blue-400">Privacy Policy</a>
              <a href="#" className="hover:underline text-blue-400">Cookie Policy</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default UserPage;
