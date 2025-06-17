"use client"; // Penting: Direktif ini harus ada di baris paling atas

import React, { useState } from 'react';
import { User } from '@/app/types'; // Pastikan path import ini benar
import { RiEyeLine, RiEyeOffLine, RiCloseLine, RiLoginCircleLine } from 'react-icons/ri'; // Import ikon

interface LoginPageProps {
  // Pastikan tipe ini cocok dengan yang di App.tsx
  setCurrentView: React.Dispatch<React.SetStateAction<'login' | 'register' | 'user' | 'admin' | 'guest' | 'payment' | 'forgot-password'>>; // Ditambahkan 'forgot-password'
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  showMessage: (msg: string, type: 'success' | 'error') => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ setCurrentView, setIsAuthenticated, setUser, showMessage }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${window.location.origin}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      let data;
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Login gagal dengan status:', response.status, 'Teks respons:', errorText);
        try {
          data = JSON.parse(errorText);
        } catch (parseError) {
          data = { error: `Kesalahan server (${response.status}): ${errorText.substring(0, 100)}...` };
        }
        showMessage(data.error || 'Login gagal', 'error');
        return;
      }

      data = await response.json();

      if (data.user) {
        setUser(data.user as User);
        setIsAuthenticated(true);
        if ((data.user as User).role === 'admin') {
          setCurrentView('admin');
        } else {
          setCurrentView('user');
        }
        showMessage('Login berhasil!', 'success');
      } else {
        showMessage(data.error || 'Login gagal: Data pengguna tidak ditemukan.', 'error');
      }
    } catch (error) {
      console.error('Kesalahan login:', error);
      showMessage('Kesalahan jaringan saat login.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-md bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-2xl border border-blue-100">
      {/* Background decorative elements */}
      <div className="absolute -top-4 -right-4 w-16 h-16 bg-blue-400 rounded-full opacity-10"></div>
      <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-blue-600 rounded-full opacity-10"></div>
      
      {/* Close button */}
      <button
        onClick={() => setCurrentView('guest')}
        className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors duration-200 rounded-full hover:bg-gray-100"
        aria-label="Kembali ke halaman awal"
      >
        <RiCloseLine className="h-5 w-5" />
      </button>

      {/* Header */}
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full flex items-center justify-center shadow-md mb-4">
          <RiLoginCircleLine className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Masuk ke Akun Anda</h2>
        <p className="text-gray-600">Silakan masukkan email dan password Anda</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Field */}
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Alamat Email</label>
          <div className="relative">
            <input
              type="email"
              id="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-gray-900 placeholder-gray-400"
              placeholder="your@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <button
              type="button"
              onClick={() => setCurrentView('forgot-password')} // PERUBAHAN DI SINI
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              Lupa password?
            </button>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-gray-900 placeholder-gray-400 pr-12"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-600 focus:outline-none"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <RiEyeOffLine className="h-5 w-5" />
              ) : (
                <RiEyeLine className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-xl shadow-md hover:from-blue-700 hover:to-blue-600 transition duration-300 ease-in-out flex items-center justify-center ${
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
              Memproses...
            </>
          ) : (
            'Masuk Sekarang'
          )}
        </button>
      </form>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-gray-600 text-sm">
          Belum punya akun?{' '}
          <button
            onClick={() => setCurrentView('register')}
            className="text-blue-600 hover:text-blue-800 font-medium transition duration-200"
          >
            Buat akun baru
          </button>
        </p>
        
        {/* Social Login Options */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Atau masuk dengan</span>
            </div>
          </div>
          
          <div className="mt-4 flex justify-center space-x-4">
            <button
              type="button"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-300 shadow-sm hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              type="button"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-300 shadow-sm hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
