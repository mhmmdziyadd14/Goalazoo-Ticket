"use client";

import React, { useState, useEffect } from 'react';
import { User } from '@/app/types';
import { fetchUsers, deleteUser, updateUser } from '@/lib/api';
import { RiUserLine, RiMailLine, RiShieldUserLine, RiEditLine, RiDeleteBinLine, RiSaveLine, RiCloseLine, RiLoader4Line } from 'react-icons/ri'; // Pastikan semua ikon diimpor

interface UserListProps {
  showMessage: (msg: string, type: 'success' | 'error') => void;
}

const UserList: React.FC<UserListProps> = ({ showMessage }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (error: any) {
      showMessage(error.message || 'Gagal memuat pengguna.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
      try {
        await deleteUser(id);
        showMessage('Pengguna berhasil dihapus!', 'success');
        loadUsers();
      } catch (error: any) {
        showMessage(error.message || 'Gagal menghapus pengguna.', 'error');
      }
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser({ ...user });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setIsUpdating(true);
    try {
      await updateUser(editingUser.id, {
        username: editingUser.username,
        email: editingUser.email,
        role: editingUser.role,
      });
      showMessage('Pengguna berhasil diperbarui!', 'success');
      setEditingUser(null);
      loadUsers();
    } catch (error: any) {
      showMessage(error.message || 'Gagal memperbarui pengguna.', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RiLoader4Line className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <RiUserLine className="text-2xl text-blue-600" />
        <h3 className="text-xl font-bold text-gray-800">Daftar Pengguna</h3>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Tidak ada pengguna yang tersedia.
        </div>
      ) : (
        <ul className="space-y-3">
          {users.map((userItem) => (
            <li
              key={userItem.id}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
            >
              {editingUser?.id === userItem.id ? (
                <form onSubmit={handleUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Username Field */}
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                        <RiUserLine className="text-gray-500" />
                        Username
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={editingUser.username}
                          onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-700" // Added placeholder-gray-700
                          required
                        />
                        <RiUserLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      </div>
                    </div>

                    {/* Email Field */}
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                        <RiMailLine className="text-gray-500" />
                        Email
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          value={editingUser.email}
                          onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-700" // Added placeholder-gray-700
                          required
                        />
                        <RiMailLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      </div>
                    </div>

                    {/* Role Field */}
                    <div className="space-y-1 md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                        <RiShieldUserLine className="text-gray-500" />
                        Role
                      </label>
                      <div className="relative">
                        <select
                          value={editingUser.role}
                          onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as 'user' | 'admin' })}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none text-gray-900" // Added text-gray-900
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
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingUser(null)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition flex items-center gap-2"
                    >
                      <RiCloseLine />
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-70"
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <RiLoader4Line className="animate-spin" />
                      ) : (
                        <RiSaveLine />
                      )}
                      Simpan
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <RiUserLine className="text-blue-500" />
                      <span className="font-medium text-gray-800">{userItem.username}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <RiMailLine className="text-gray-400" />
                      <span>{userItem.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <RiShieldUserLine className={
                        userItem.role === 'admin' ? 'text-purple-500' : 'text-gray-400'
                      } />
                      <span className={
                        userItem.role === 'admin'
                          ? 'text-purple-600 font-medium'
                          : 'text-gray-600'
                      }>
                        {userItem.role === 'admin' ? 'Administrator' : 'User'}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 self-end md:self-center">
                    <button
                      onClick={() => handleEdit(userItem)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Edit"
                    >
                      <RiEditLine />
                    </button>
                    <button
                      onClick={() => handleDelete(userItem.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Hapus"
                    >
                      <RiDeleteBinLine />
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserList;
