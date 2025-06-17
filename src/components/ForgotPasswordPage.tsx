"use client";

import React, { useState } from 'react';
import { RiMailLine, RiArrowLeftLine, RiLockPasswordLine } from 'react-icons/ri'; // Import ikon
import { User } from '@/app/types'; // Hanya untuk setCurrentView props typing

interface ForgotPasswordPageProps {
  setCurrentView: React.Dispatch<React.SetStateAction<'login' | 'register' | 'user' | 'admin' | 'guest' | 'payment' | 'forgot-password'>>;
  showMessage: (msg: string, type: 'success' | 'error') => void;
}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ setCurrentView, showMessage }) => {
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Di sini Anda akan memanggil API backend untuk mengirim email reset password
    // Contoh dummy API call:
    try {
      // const response = await fetch(`${window.location.origin}/api/auth/forgot-password`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email }),
      // });
      // const data = await response.json();

      // if (response.ok) {
        showMessage('Link reset password telah dikirim ke email Anda!', 'success');
        setCurrentView('login'); // Kembali ke halaman login setelah permintaan dikirim
      // } else {
      //   showMessage(data.error || 'Gagal mengirim link reset password.', 'error');
      // }
    } catch (error) {
      console.error('Kesalahan lupa password:', error);
      showMessage('Kesalahan jaringan saat mengirim permintaan.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-md bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-2xl border border-purple-100">
      {/* Background decorative elements */}
      <div className="absolute -top-4 -right-4 w-16 h-16 bg-purple-400 rounded-full opacity-10"></div>
      <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-purple-600 rounded-full opacity-10"></div>
      
      {/* Tombol kembali */}
      <button
        onClick={() => setCurrentView('login')}
        className="absolute top-4 left-4 p-2 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors duration-200 rounded-full hover:bg-gray-100"
        aria-label="Kembali ke Login"
      >
        <RiArrowLeftLine className="h-5 w-5" />
      </button>

      {/* Header */}
      <div className="text-center mb-8 mt-4"> {/* Tambahkan mt-4 untuk menjauh dari tombol kembali */}
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-400 rounded-full flex items-center justify-center shadow-md mb-4">
          <RiLockPasswordLine className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Lupa Password?</h2>
        <p className="text-gray-600">Masukkan email Anda untuk menerima link reset password.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Field */}
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Alamat Email</label>
          <div className="relative">
            <input
              type="email"
              id="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 text-gray-900 placeholder-gray-400"
              placeholder="your@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <RiMailLine className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold rounded-xl shadow-md hover:from-purple-700 hover:to-purple-600 transition duration-300 ease-in-out flex items-center justify-center ${
            loading ? 'opacity-80 cursor-not-allowed' : ''
          }`}
          disabled={loading}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Mengirim...
            </>
          ) : (
            'Kirim Link Reset'
          )}
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
