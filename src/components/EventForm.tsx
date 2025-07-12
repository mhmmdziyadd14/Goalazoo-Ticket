"use client";

import React, { useState, useEffect } from 'react';
import { createEvent, fetchCategories } from '@/lib/api';
import { Event, Category } from '@/app/types';
import { RiTeamFill, RiCalendarEventFill, RiMapPinFill, RiInformationFill, RiImageAddFill, RiLoader4Line } from 'react-icons/ri';

interface EventFormProps {
  onEventCreated: (event: Event) => void;
  showMessage?: (msg: string, type: 'success' | 'error') => void;
}

const EventForm: React.FC<EventFormProps> = ({ onEventCreated, showMessage }) => {
  const [formData, setFormData] = useState({
    team1Name: '',
    team2Name: '',
    team1LogoUrl: '',
    team2LogoUrl: '',
    description: '',
    location: '',
    date: '',
    categoryId: ''
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadCategories = async () => {
      setLoadingCategories(true);
      try {
        const fetchedCategories = await fetchCategories();
        setCategories(fetchedCategories);
        if (fetchedCategories.length > 0) {
          setFormData(prev => ({ ...prev, categoryId: fetchedCategories[0].id.toString() }));
        } else {
          setFormData(prev => ({ ...prev, categoryId: '' }));
        }
      } catch (error) {
        console.error('Gagal memuat kategori:', error);
        showMessage?.('Gagal memuat kategori.', 'error');
      } finally {
        setLoadingCategories(false);
      }
    };
    loadCategories();
  }, [showMessage]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newEventData: Omit<Event, 'id' | 'created_at' | 'price' | 'available_tickets' | 'name' | 'category' | 'tickets_available'> = {
      team1_name: formData.team1Name,
      team2_name: formData.team2Name,
      team1_logo_url: formData.team1LogoUrl || undefined,
      team2_logo_url: formData.team2LogoUrl || undefined,
      description: formData.description || undefined,
      location: formData.location,
      date: formData.date,
      category_id: parseInt(formData.categoryId),
      // category: undefined, // DIHAPUS
      // tickets_available: undefined // DIHAPUS
    };

    try {
      const createdEvent = await createEvent(newEventData);
      onEventCreated(createdEvent);
      showMessage?.('Acara pertandingan berhasil dibuat!', 'success');
      setFormData({
        team1Name: '',
        team2Name: '',
        team1LogoUrl: '',
        team2LogoUrl: '',
        description: '',
        location: '',
        date: '',
        categoryId: categories.length > 0 ? categories[0].id.toString() : ''
      });
    } catch (error: any) {
      console.error("Gagal membuat acara pertandingan:", error);
      showMessage?.(error.message || "Gagal membuat acara pertandingan.", 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
        <h3 className="text-2xl font-bold flex items-center">
          <RiCalendarEventFill className="mr-3" />
          Buat Pertandingan Baru
        </h3>
        <p className="text-blue-100 mt-1">Isi detail pertandingan di bawah ini</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Team 1 Section */}
          <div className="space-y-4">
            <div className="flex items-center text-gray-700">
              <RiTeamFill className="mr-2 text-blue-600" />
              <h4 className="font-medium">Tim 1</h4>
            </div>
            <div>
              <label htmlFor="team1Name" className="block text-sm font-medium text-gray-700 mb-1">Nama Tim</label>
              <input
                type="text"
                id="team1Name"
                name="team1Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-gray-900 placeholder-gray-700"
                value={formData.team1Name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="team1LogoUrl" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <RiImageAddFill className="mr-1" /> Logo URL
              </label>
              <input
                type="url"
                id="team1LogoUrl"
                name="team1LogoUrl"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-gray-900 placeholder-gray-700"
                placeholder="https://example.com/logo1.png"
                value={formData.team1LogoUrl}
                onChange={handleChange}
              />
              {formData.team1LogoUrl && (
                <div className="mt-2 flex items-center">
                  <span className="text-xs text-gray-500 mr-2">Pratinjau:</span>
                  <img src={formData.team1LogoUrl} alt="Team 1 Logo Preview" className="h-8 w-8 object-contain" onError={(e) => (e.currentTarget.style.display = 'none')} />
                </div>
              )}
            </div>
          </div>

          {/* Team 2 Section */}
          <div className="space-y-4">
            <div className="flex items-center text-gray-700">
              <RiTeamFill className="mr-2 text-red-600" />
              <h4 className="font-medium">Tim 2</h4>
            </div>
            <div>
              <label htmlFor="team2Name" className="block text-sm font-medium text-gray-700 mb-1">Nama Tim</label>
              <input
                type="text"
                id="team2Name"
                name="team2Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-gray-900 placeholder-gray-700"
                value={formData.team2Name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="team2LogoUrl" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <RiImageAddFill className="mr-1" /> Logo URL
              </label>
              <input
                type="url"
                id="team2LogoUrl"
                name="team2LogoUrl"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-gray-900 placeholder-gray-700"
                placeholder="https://example.com/logo2.png"
                value={formData.team2LogoUrl}
                onChange={handleChange}
              />
              {formData.team2LogoUrl && (
                <div className="mt-2 flex items-center">
                  <span className="text-xs text-gray-500 mr-2">Pratinjau:</span>
                  <img src={formData.team2LogoUrl} alt="Team 2 Logo Preview" className="h-8 w-8 object-contain" onError={(e) => (e.currentTarget.style.display = 'none')} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Event Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <RiMapPinFill className="mr-1" /> Lokasi
            </label>
            <input
              type="text"
              id="location"
              name="location"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-gray-900 placeholder-gray-700"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <RiCalendarEventFill className="mr-1" /> Tanggal & Waktu
            </label>
            <input
              type="datetime-local"
              id="date"
              name="date"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-gray-900 placeholder-gray-700"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <RiInformationFill className="mr-1" /> Deskripsi
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-gray-900 placeholder-gray-700"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
          {loadingCategories ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              <span className="text-gray-600">Memuat kategori...</span>
            </div>
          ) : categories.length > 0 ? (
            <select
              id="categoryId"
              name="categoryId"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-gray-900"
              value={formData.categoryId}
              onChange={handleChange}
              required
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          ) : (
            <div className="text-red-500 text-sm">Tidak ada kategori tersedia. Silakan buat kategori terlebih dahulu.</div>
          )}
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className={`w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg shadow-md hover:from-blue-700 hover:to-blue-600 transition duration-300 ease-in-out flex items-center justify-center ${
              loading || loadingCategories || categories.length === 0 ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            disabled={loading || loadingCategories || categories.length === 0}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Membuat...
              </>
            ) : (
              'Buat Pertandingan'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;