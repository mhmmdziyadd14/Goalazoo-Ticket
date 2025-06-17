"use client";

import React, { useState } from 'react';
import { createUser } from '@/lib/api';
import { User } from '@/app/types';
import { RiUserAddLine, RiUserLine, RiMailLine, RiLockLine, RiShieldUserLine, RiLoader4Line } from 'react-icons/ri';

interface UserFormProps {
  onUserCreated: (user: User) => void;
  showMessage?: (msg: string, type: 'success' | 'error') => void;
}

const UserForm: React.FC<UserFormProps> = ({ onUserCreated, showMessage }) => {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newUser: Omit<User, 'id' | 'created_at'> = {
        username,
        email,
        password,
        role,
      };
      const response = await createUser(newUser);

      if (response.message) {
        showMessage?.(response.message, 'success');
        if (response.user) {
          onUserCreated(response.user);
        } else {
          onUserCreated({ id: Date.now(), ...newUser, password: '' } as User);
        }
      } else {
        showMessage?.('Pembuatan pengguna berhasil, tetapi tidak ada pesan dari API.', 'success');
        onUserCreated({ id: Date.now(), ...newUser, password: '' } as User);
      }

      // Reset form fields
      setUsername('');
      setEmail('');
      setPassword('');
      setRole('user');
    } catch (error: any) {
      console.error('Gagal membuat pengguna:', error);
      showMessage?.(error.message || 'Gagal membuat pengguna.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <RiUserAddLine className="text-2xl text-blue-600" />
        <h3 className="text-xl font-bold text-gray-800">Buat Pengguna Baru</h3>
      </div>

      <div className="space-y-4">
        {/* Username Field */}
        <div className="space-y-1">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <RiUserLine className="text-gray-500" />
            Username
          </label>
          <div className="relative">
            <input
              type="text"
              id="username"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-gray-900 placeholder-gray-700" // Added placeholder-gray-700
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="masukkan username"
            />
            <RiUserLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Email Field */}
        <div className="space-y-1">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <RiMailLine className="text-gray-500" />
            Email
          </label>
          <div className="relative">
            <input
              type="email"
              id="email"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-gray-900 placeholder-gray-700" // Added placeholder-gray-700
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <RiMailLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-1">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <RiLockLine className="text-gray-500" />
            Password
          </label>
          <div className="relative">
            <input
              type="password"
              id="password"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-gray-900 placeholder-gray-700" // Added placeholder-gray-700
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="buat password"
            />
            <RiLockLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Role Field */}
        <div className="space-y-1">
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <RiShieldUserLine className="text-gray-500" />
            Role
          </label>
          <div className="relative">
            <select
              id="role"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-gray-900 appearance-none" // Added text-gray-900
              value={role}
              onChange={(e) => setRole(e.target.value as 'user' | 'admin')}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <RiShieldUserLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? (
            <>
              <RiLoader4Line className="animate-spin" />
              Membuat Pengguna...
            </>
          ) : (
            <>
              <RiUserAddLine />
              Buat Pengguna
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default UserForm;
