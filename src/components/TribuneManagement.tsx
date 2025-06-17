"use client";

import React, { useState, useEffect } from 'react';
import { Tribune, Event } from '@/app/types';
import { fetchTribunesByEvent, createTribune, updateTribune, deleteTribune } from '@/lib/api';
import { RiCloseLine, RiEdit2Line, RiDeleteBinLine, RiAddLine, RiSaveLine, RiCloseCircleLine, RiCoupon2Line, RiMoneyDollarCircleLine, RiCarLine } from 'react-icons/ri';

interface TribuneManagementProps {
  eventId: number;
  eventName: string;
  showMessage: (msg: string, type: 'success' | 'error') => void;
  onClose: () => void;
}

const TribuneManagement: React.FC<TribuneManagementProps> = ({ eventId, eventName, showMessage, onClose }) => {
  const [tribunes, setTribunes] = useState<Tribune[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [newTribune, setNewTribune] = useState<Omit<Tribune, 'id' | 'created_at'>>({
    event_id: eventId,
    name: '',
    price: 0,
    available_seats: 0,
  });
  const [editingTribune, setEditingTribune] = useState<Tribune | null>(null);

  const loadTribunes = async () => {
    setLoading(true);
    try {
      const data = await fetchTribunesByEvent(eventId);
      setTribunes(data);
    } catch (error: any) {
      showMessage(error.message || 'Gagal memuat tribun.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTribunes();
  }, [eventId]);

  const handleCreateTribune = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const createdTribune = await createTribune(newTribune);
      showMessage('Tribun berhasil ditambahkan!', 'success');
      setNewTribune({ event_id: eventId, name: '', price: 0, available_seats: 0 });
      loadTribunes();
    } catch (error: any) {
      console.error('Gagal membuat tribun:', error);
      showMessage(error.message || 'Gagal membuat tribun.', 'error');
    }
  };

  const handleUpdateTribune = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTribune) return;

    try {
      const updatedTribune = await updateTribune(editingTribune.id, {
        name: editingTribune.name,
        price: editingTribune.price,
        available_seats: editingTribune.available_seats,
      });
      showMessage('Tribun berhasil diperbarui!', 'success');
      setEditingTribune(null);
      loadTribunes();
    } catch (error: any) {
      showMessage(error.message || 'Gagal memperbarui tribun.', 'error');
    }
  };

  const handleDeleteTribune = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus tribun ini?')) {
      try {
        await deleteTribune(id);
        showMessage('Tribun berhasil dihapus!', 'success');
        loadTribunes();
      } catch (error: any) {
        showMessage(error.message || 'Gagal menghapus tribun.', 'error');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-4xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 p-1 rounded-full transition duration-200"
          aria-label="Tutup"
        >
          <RiCloseLine className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-2 mb-6">
          <RiCoupon2Line className="text-2xl text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">
            Kelola Tribun untuk <span className="text-blue-600">{eventName}</span>
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Form Tambah Tribun */}
          <div className="flex-1 p-5 bg-gray-50 rounded-xl border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <RiAddLine className="text-blue-500" />
              Tambah Tribun Baru
            </h3>
            <form onSubmit={handleCreateTribune} className="space-y-4">
              <div>
                <label htmlFor="tribuneName" className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Tribun
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="tribuneName"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={newTribune.name}
                    onChange={(e) => setNewTribune({ ...newTribune, name: e.target.value })}
                    required
                    placeholder="Misal: Tribun Utara"
                  />
                  <RiCoupon2Line className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div>
                <label htmlFor="tribunePrice" className="block text-sm font-medium text-gray-700 mb-1">
                  Harga
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="tribunePrice"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={newTribune.price}
                    onChange={(e) => setNewTribune({ ...newTribune, price: parseFloat(e.target.value) || 0 })}
                    required
                    min="0"
                    step="1000"
                    placeholder="Misal: 150000"
                  />
                  <RiMoneyDollarCircleLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div>
                <label htmlFor="availableSeats" className="block text-sm font-medium text-gray-700 mb-1">
                  Kursi Tersedia
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="availableSeats"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={newTribune.available_seats}
                    onChange={(e) => setNewTribune({ ...newTribune, available_seats: parseInt(e.target.value) || 0 })}
                    required
                    min="0"
                    placeholder="Misal: 100"
                  />
                  <RiCarLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition duration-300 flex items-center justify-center gap-2"
                disabled={loading}
              >
                <RiAddLine className="text-lg" />
                Tambah Tribun
              </button>
            </form>
          </div>

          {/* Daftar Tribun */}
          <div className="flex-1 p-5 bg-gray-50 rounded-xl border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <RiCoupon2Line className="text-blue-500" />
              Daftar Tribun
            </h3>
            
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : tribunes.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Tidak ada tribun untuk event ini.
              </div>
            ) : (
              <ul className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {tribunes.map((tribune) => (
                  <li key={tribune.id} className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    {editingTribune?.id === tribune.id ? (
                      <form onSubmit={handleUpdateTribune} className="space-y-3">
                        <div className="relative">
                          <input
                            type="text"
                            value={editingTribune.name}
                            onChange={(e) => setEditingTribune({ ...editingTribune, name: e.target.value })}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg"
                            required
                          />
                          <RiCoupon2Line className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div className="relative">
                            <input
                              type="number"
                              value={editingTribune.price}
                              onChange={(e) => setEditingTribune({ ...editingTribune, price: parseFloat(e.target.value) || 0 })}
                              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg"
                              required
                              min="0"
                            />
                            <RiMoneyDollarCircleLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          </div>
                          
                          <div className="relative">
                            <input
                              type="number"
                              value={editingTribune.available_seats}
                              onChange={(e) => setEditingTribune({ ...editingTribune, available_seats: parseInt(e.target.value) || 0 })}
                              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg"
                              required
                              min="0"
                            />
                            <RiCarLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          </div>
                        </div>
                        
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingTribune(null)}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition flex items-center gap-2"
                          >
                            <RiCloseCircleLine />
                            Batal
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                          >
                            <RiSaveLine />
                            Simpan
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-lg text-gray-800">{tribune.name}</h4>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <RiMoneyDollarCircleLine className="text-green-500" />
                              Rp{parseFloat(tribune.price.toString()).toLocaleString('id-ID')}
                            </span>
                            <span className="flex items-center gap-1">
                              <RiCarLine className="text-blue-500" />
                              {tribune.available_seats} kursi tersedia
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => setEditingTribune(tribune)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Edit"
                          >
                            <RiEdit2Line />
                          </button>
                          <button
                            onClick={() => handleDeleteTribune(tribune.id)}
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
        </div>
      </div>
    </div>
  );
};

export default TribuneManagement;