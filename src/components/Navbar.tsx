"use client"; // Penting: Direktif ini harus ada di baris paling atas

import React, { useState, useRef, useEffect } from 'react';
import { User } from '@/app/types'; // Pastikan path import ini benar
import {
  RiFootballFill,
  RiUserLine,       // Diperlukan untuk "Profil Saya"
  RiLogoutCircleRLine, // Diperlukan untuk "Keluar"
  RiArrowDownSLine,   // Diperlukan untuk ikon dropdown
  RiArrowUpSLine      // Diperlukan untuk ikon dropdown
} from 'react-icons/ri'; // Pastikan Anda telah menginstal react-icons

interface NavbarProps {
  user: User | null; // Objek pengguna, bisa null jika belum login
  handleLogout: () => void; // Fungsi untuk menangani logout
  // --- PENTING: PERBAIKAN DI SINI ---
  // Tipe ini harus cocok PERSIS dengan tipe setter dari useState di App.tsx (src/app/page.tsx).
  // Pastikan SEMUA opsi tampilan yang ada di App.tsx disertakan di sini.
  setCurrentView: React.Dispatch<React.SetStateAction<'login' | 'register' | 'user' | 'admin' | 'guest' | 'payment' | 'forgot-password'>>;
  // --- AKHIR PERBAIKAN ---
}

const Navbar: React.FC<NavbarProps> = ({ user, handleLogout, setCurrentView }) => {
  // State untuk mengontrol visibilitas dropdown profil
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  // Ref untuk dropdown profil guna mendeteksi klik di luar
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Fungsi untuk mengaktifkan/menonaktifkan visibilitas dropdown profil
  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(prev => !prev);
  };

  // Efek untuk menutup dropdown ketika mengklik di luar area dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };

    // Tambahkan event listener saat dropdown terbuka
    if (isProfileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      // Bersihkan event listener saat dropdown tertutup
      document.removeEventListener('mousedown', handleClickOutside);
    }

    // Fungsi cleanup untuk menghapus event listener saat komponen di-unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileDropdownOpen]); // Jalankan ulang efek saat state dropdown berubah

  return (
    <nav className="w-full bg-gradient-to-r from-blue-900 to-blue-800 p-4 shadow-xl fixed top-0 left-0 right-0 z-50 border-b border-blue-700">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo/Brand Section */}
        <button
          onClick={() => setCurrentView('guest')}
          className="flex items-center space-x-2 group focus:outline-none"
        >
          <div className="p-2 bg-blue-700 rounded-lg group-hover:bg-blue-600 transition-all duration-300 shadow-md">
            <RiFootballFill className="h-6 w-6 text-yellow-400" />
          </div>
          <span className="text-white text-2xl font-bold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-400">
              Goalazoo
            </span>
            <span className="text-blue-200">.</span>
          </span>
        </button>

        {/* User Actions Section */}
        <div className="relative flex items-center space-x-4">
          {user ? (
            <>
              {/* User Profile Button */}
              <button
                onClick={toggleProfileDropdown}
                className="flex items-center space-x-2 bg-blue-700/50 hover:bg-blue-700 px-4 py-2 rounded-lg transition-all duration-200 shadow-sm border border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-blue-900"
              >
                <span className="text-blue-100 font-medium">{user.username || 'Pengguna'}</span>
                {isProfileDropdownOpen ? (
                  <RiArrowUpSLine className="text-blue-300 h-4 w-4" />
                ) : (
                  <RiArrowDownSLine className="text-blue-300 h-4 w-4" />
                )}
              </button>

              {/* Profile Dropdown */}
              {isProfileDropdownOpen && (
                <div
                  ref={profileDropdownRef}
                  className="absolute right-0 mt-2 w-56 bg-blue-800 rounded-lg shadow-xl py-1 z-10 top-full border border-blue-700"
                >
                  <div className="px-4 py-3 border-b border-blue-700">
                    <p className="text-sm font-medium text-white">{user.username || 'Pengguna'}</p>
                    <p className="text-xs text-blue-200 truncate">{user.email}</p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setCurrentView('user');
                        setIsProfileDropdownOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-blue-100 hover:bg-blue-700 transition-colors duration-150"
                    >
                      <RiUserLine className="mr-2" />
                      Profil Saya
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-300 hover:bg-blue-700 transition-colors duration-150"
                    >
                      <RiLogoutCircleRLine className="mr-2" />
                      Keluar
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <button
                onClick={() => setCurrentView('login')}
                className="text-blue-100 hover:text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-blue-900 border border-transparent hover:border-blue-600"
              >
                Masuk
              </button>
              <button
                onClick={() => setCurrentView('register')}
                className="bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-500 text-blue-900 px-6 py-2 rounded-lg font-semibold shadow-md transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-blue-900"
              >
                Daftar
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
