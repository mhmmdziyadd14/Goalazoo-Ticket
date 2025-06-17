"use client";

import React, { useState } from 'react';
import { createUser } from '@/lib/api';
import { User } from '@/app/types';
import { RiEyeLine, RiEyeOffLine, RiCloseLine, RiUserAddLine, RiLockLine, RiMailLine, RiUserLine } from 'react-icons/ri';

interface RegisterPageProps {
  setCurrentView: React.Dispatch<React.SetStateAction<'login' | 'register' | 'user' | 'admin' | 'guest' | 'payment' | 'forgot-password'>>;
  showMessage: (msg: string, type: 'success' | 'error') => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ setCurrentView, showMessage }) => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false
  });
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Password confirmation check
    if (formData.password !== formData.confirmPassword) {
      showMessage('Password dan konfirmasi password tidak cocok', 'error');
      return;
    }

    setLoading(true);
    try {
      const newUser: Omit<User, 'id' | 'created_at'> = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: 'user',
      };
      await createUser(newUser);
      showMessage('Pendaftaran berhasil! Silakan login.', 'success');
      setCurrentView('login');
    } catch (error: any) {
      console.error('Kesalahan pendaftaran:', error);
      showMessage(error.message || 'Pendaftaran gagal', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-lg bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-2xl border border-green-100"> {/* Perubahan di sini: max-w-md menjadi max-w-lg */}
      {/* Background decorative elements */}
      <div className="absolute -top-4 -right-4 w-16 h-16 bg-green-400 rounded-full opacity-10"></div>
      <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-green-600 rounded-full opacity-10"></div>
      
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
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-600 to-green-400 rounded-full flex items-center justify-center shadow-md mb-4">
          <RiUserAddLine className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Buat Akun Baru</h2>
        <p className="text-gray-600">Isi formulir berikut untuk mendaftar</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6"> {/* Hapus 'p-6' dari sini jika sudah ada di div luar */}
        {/* Username Field */}
        <div className="space-y-2">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <RiUserLine className="text-gray-500" />
            Username
          </label>
          <div className="relative">
            <input
              type="text"
              id="username"
              name="username"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 text-gray-900 placeholder-gray-700"
              placeholder="yourusername"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <RiMailLine className="text-gray-500" />
            Email
          </label>
          <div className="relative">
            <input
              type="email"
              id="email"
              name="email"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 text-gray-900 placeholder-gray-700"
              placeholder="user@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <RiLockLine className="text-gray-500" />
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword.password ? 'text' : 'password'}
              id="password"
              name="password"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 text-gray-900 placeholder-gray-700"
              placeholder="buat password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(prev => ({...prev, password: !prev.password}))}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label={showPassword.password ? 'Hide password' : 'Show password'}
            >
              {showPassword.password ? (
                <RiEyeOffLine className="h-5 w-5" />
              ) : (
                <RiEyeLine className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <RiLockLine className="text-gray-500" />
            Konfirmasi Password
          </label>
          <div className="relative">
            <input
              type={showPassword.confirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 text-gray-900 placeholder-gray-700"
              placeholder="konfirmasi password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(prev => ({...prev, confirmPassword: !prev.confirmPassword}))}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label={showPassword.confirmPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword.confirmPassword ? (
                <RiEyeOffLine className="h-5 w-5" />
              ) : (
                <RiEyeLine className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Password Requirements */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-blue-800 mb-2">Persyaratan Password:</h4>
          <ul className="text-xs text-blue-700 space-y-1">
            <li className={`flex items-center ${formData.password.length >= 6 ? 'text-green-600' : ''}`}>
              {formData.password.length >= 6 ? '✓' : '•'} Minimal 6 karakter
            </li>
            <li className="flex items-center">
              • Gunakan kombinasi huruf dan angka
            </li>
          </ul>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full py-3 px-4 bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold rounded-xl shadow-md hover:from-green-700 hover:to-green-600 transition duration-300 ease-in-out flex items-center justify-center ${
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
            'Daftar Sekarang'
          )}
        </button>
      </form>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-gray-600 text-sm">
          Sudah punya akun?{' '}
          <button
            onClick={() => setCurrentView('login')}
            className="text-blue-600 hover:text-blue-800 font-medium transition duration-200"
          >
            Masuk di sini
          </button>
        </p>
        
        {/* Social Login Options */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Atau daftar dengan</span>
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

export default RegisterPage;