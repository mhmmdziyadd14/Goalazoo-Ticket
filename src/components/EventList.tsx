"use client";

import React, { useState, useEffect } from 'react';
import { Event, Category } from '@/app/types'; // Import Category
import { fetchEvents, deleteEvent, updateEvent, fetchCategories } from '@/lib/api'; // Import fetchCategories
import TribuneManagement from '@/components/TribuneManagement';
import {
  RiCalendarEventLine,
  RiDeleteBinLine,
  RiEditLine,
  RiCloseLine,
  RiCheckLine,
  RiTeamLine,
  RiMapPinLine,
  RiTimeLine,
  RiInformationLine,
  RiImageAddFill
} from 'react-icons/ri';
import { MdStadium } from "react-icons/md";

interface EventListProps {
  showMessage: (msg: string, type: 'success' | 'error') => void;
}

const EventList: React.FC<EventListProps> = ({ showMessage }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<Category[]>([]); // State untuk kategori
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true); // Loading state untuk kategori
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [managingTribunesForEvent, setManagingTribunesForEvent] = useState<Event | null>(null);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const data = await fetchEvents();
      setEvents(data);
    } catch (error: any) {
      showMessage(error.message || 'Gagal memuat acara.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    setLoadingCategories(true);
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (error: any) {
      showMessage(error.message || 'Gagal memuat kategori.', 'error');
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    loadEvents();
    loadCategories(); // Muat kategori saat komponen dimuat
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus acara ini? Ini juga akan menghapus semua tribun dan pesanan terkait!')) {
      try {
        await deleteEvent(id);
        showMessage('Acara berhasil dihapus!', 'success');
        loadEvents(); // Reload events after deletion
      } catch (error: any) {
        showMessage(error.message || 'Gagal menghapus acara.', 'error');
      }
    }
  };

  const handleEdit = (event: Event) => {
    const formattedDate = event.date ? new Date(event.date).toISOString().substring(0, 16) : '';
    setEditingEvent({ ...event, date: formattedDate });
  };

  const handleUpdate = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!editingEvent) return;

      try {
        const updatedData: Partial<Omit<Event, 'id' | 'created_at' | 'price' | 'available_tickets' | 'name'>> = {
          team1_name: editingEvent.team1_name,
          team2_name: editingEvent.team2_name,
          team1_logo_url: editingEvent.team1_logo_url,
          team2_logo_url: editingEvent.team2_logo_url,
          description: editingEvent.description,
          date: editingEvent.date,
          location: editingEvent.location,
          category_id: editingEvent.category_id, // Sertakan category_id di sini
        };
        await updateEvent(editingEvent.id, updatedData);
        showMessage('Acara berhasil diperbarui!', 'success');
        setEditingEvent(null);
        loadEvents();
      } catch (error: any) {
        showMessage(error.message || 'Gagal memperbarui acara.', 'error');
      }
    };

    // Fungsi pembantu untuk mendapatkan nama kategori dari ID
    const getCategoryName = (categoryId: number) => {
        const category = categories.find(cat => cat.id === categoryId);
        return category ? category.name : 'Tidak Dikenal';
    };

    if (loading || loadingCategories) { // Perbarui kondisi loading
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
          <h3 className="text-2xl font-bold flex items-center">
            <RiCalendarEventLine className="mr-3" />
            Daftar Pertandingan
          </h3>
          <p className="text-blue-100 mt-1">Kelola semua pertandingan yang tersedia</p>
        </div>

        <div className="p-6">
          {events.length === 0 ? (
            <div className="text-center py-8">
              <RiCalendarEventLine className="mx-auto text-4xl text-gray-400 mb-4" />
              <p className="text-gray-600">Tidak ada pertandingan yang tersedia.</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {events.map((event) => (
                <div key={event.id} className="bg-gray-50 rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  {editingEvent?.id === event.id ? (
                    // Edit Form
                    <form onSubmit={handleUpdate} className="p-4 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor={`editTeam1Name-${event.id}`} className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                            <RiTeamLine className="mr-1" /> Nama Tim 1
                          </label>
                          <input
                            type="text"
                            id={`editTeam1Name-${event.id}`}
                            value={editingEvent.team1_name}
                            onChange={(e) => setEditingEvent({ ...editingEvent, team1_name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-gray-900 placeholder-gray-700" // text-gray-900, placeholder-gray-700
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor={`editTeam1Logo-${event.id}`} className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                            <RiImageAddFill className="mr-1" /> URL Logo Tim 1
                          </label>
                          <input
                            type="url"
                            id={`editTeam1Logo-${event.id}`}
                            value={editingEvent.team1_logo_url || ''}
                            onChange={(e) => setEditingEvent({ ...editingEvent, team1_logo_url: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-gray-900 placeholder-gray-700" // text-gray-900, placeholder-gray-700
                          />
                        </div>
                        <div>
                          <label htmlFor={`editTeam2Name-${event.id}`} className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                            <RiTeamLine className="mr-1" /> Nama Tim 2
                          </label>
                          <input
                            type="text"
                            id={`editTeam2Name-${event.id}`}
                            value={editingEvent.team2_name}
                            onChange={(e) => setEditingEvent({ ...editingEvent, team2_name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-gray-900 placeholder-gray-700" // text-gray-900, placeholder-gray-700
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor={`editTeam2Logo-${event.id}`} className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                            <RiImageAddFill className="mr-1" /> URL Logo Tim 2
                          </label>
                          <input
                            type="url"
                            id={`editTeam2Logo-${event.id}`}
                            value={editingEvent.team2_logo_url || ''}
                            onChange={(e) => setEditingEvent({ ...editingEvent, team2_logo_url: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-gray-900 placeholder-gray-700" // text-gray-900, placeholder-gray-700
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor={`editLocation-${event.id}`} className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                            <RiMapPinLine className="mr-1" /> Lokasi
                          </label>
                          <input
                            type="text"
                            id={`editLocation-${event.id}`}
                            value={editingEvent.location}
                            onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-gray-900 placeholder-gray-700" // text-gray-900, placeholder-gray-700
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor={`editDate-${event.id}`} className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                            <RiTimeLine className="mr-1" /> Tanggal & Waktu
                          </label>
                          <input
                            type="datetime-local"
                            id={`editDate-${event.id}`}
                            value={editingEvent.date}
                            onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-gray-900 placeholder-gray-700" // text-gray-900, placeholder-gray-700
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor={`editDescription-${event.id}`} className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                          <RiInformationLine className="mr-1" /> Deskripsi
                        </label>
                        <textarea
                          id={`editDescription-${event.id}`}
                          value={editingEvent.description || ''}
                          onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-gray-900 placeholder-gray-700" // text-gray-900, placeholder-gray-700
                          rows={3}
                        />
                      </div>

                      <div>
                        <label htmlFor={`editCategory-${event.id}`} className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                        {loadingCategories ? (
                            <div className="flex items-center space-x-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                                <span>Memuat kategori...</span>
                            </div>
                        ) : categories.length > 0 ? (
                            <select
                                id={`editCategory-${event.id}`}
                                value={editingEvent.category_id}
                                onChange={(e) => setEditingEvent({ ...editingEvent, category_id: parseInt(e.target.value) })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-gray-900" // text-gray-900
                                required
                            >
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        ) : (
                            <p className="text-red-500 text-sm">Tidak ada kategori tersedia.</p>
                        )}
                      </div>

                      <div className="flex justify-end space-x-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setEditingEvent(null)}
                          className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200"
                        >
                          <RiCloseLine className="mr-2" /> Batal
                        </button>
                        <button
                          type="submit"
                          className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200"
                        >
                          <RiCheckLine className="mr-2" /> Simpan
                        </button>
                      </div>
                    </form>
                  ) : (
                    // Display Mode
                    <div className="p-4">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-2">
                            {event.team1_logo_url && (
                              <img
                                src={event.team1_logo_url}
                                alt={`${event.team1_name} Logo`}
                                className="w-12 h-12 object-contain bg-white p-1 rounded-full border border-gray-200"
                                onError={(e) => (e.currentTarget.src = 'https://placehold.co/48x48/cccccc/white?text=No+Logo')}
                              />
                            )}
                            <span className="font-bold text-xl text-gray-900">{event.team1_name}</span>
                            <span className="text-gray-600 text-lg font-medium">vs</span>
                            <span className="font-bold text-xl text-gray-900">{event.team2_name}</span>
                            {event.team2_logo_url && (
                              <img
                                src={event.team2_logo_url}
                                alt={`${event.team2_name} Logo`}
                                className="w-12 h-12 object-contain bg-white p-1 rounded-full border border-gray-200"
                                onError={(e) => (e.currentTarget.src = 'https://placehold.co/48x48/cccccc/white?text=No+Logo')}
                              />
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                            <div className="flex items-center">
                              <RiMapPinLine className="mr-2 text-blue-500" />
                              <span>{event.location}</span>
                            </div>
                            <div className="flex items-center">
                              <RiTimeLine className="mr-2 text-blue-500" />
                              <span>{new Date(event.date).toLocaleString('id-ID', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}</span>
                            </div>
                            <div className="flex items-center">
                              <MdStadium className="mr-2 text-blue-500" />
                              <span>Kategori: {getCategoryName(event.category_id)}</span>
                            </div>
                          </div>

                          {event.description && (
                            <div className="mt-3 text-gray-700 flex items-start">
                              <RiInformationLine className="mr-2 mt-1 text-blue-500 flex-shrink-0" />
                              <p>{event.description}</p>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-2 w-full md:w-auto">
                          <button
                            onClick={() => setManagingTribunesForEvent(event)}
                            className="flex items-center justify-center px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-200"
                          >
                            <MdStadium className="mr-2" />
                            <span className="whitespace-nowrap">Kelola Tribun</span>
                          </button>
                          <button
                            onClick={() => handleEdit(event)}
                            className="flex items-center justify-center px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-200"
                          >
                            <RiEditLine className="mr-2" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(event.id)}
                            className="flex items-center justify-center px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
                          >
                            <RiDeleteBinLine className="mr-2" />
                            Hapus
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Manajemen Tribun */}
        {managingTribunesForEvent && (
          <TribuneManagement
            eventId={managingTribunesForEvent.id}
            eventName={`${managingTribunesForEvent.team1_name} vs ${managingTribunesForEvent.team2_name}`}
            showMessage={showMessage}
            onClose={() => setManagingTribunesForEvent(null)}
          />
        )}
      </div>
    );
  };

  export default EventList;
