"use client";

import React, { useState } from 'react';
import { createCategory } from '@/lib/api';
import { Category } from '@/app/types';
import { RiAddLine, RiCloseLine, RiCheckLine, RiListCheck2 } from 'react-icons/ri';

interface CategoryFormProps {
  onCategoryCreated: (category: Category) => void;
  showMessage?: (msg: string, type: 'success' | 'error') => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ onCategoryCreated, showMessage }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const createdCategory = await createCategory(formData);
      onCategoryCreated(createdCategory);
      showMessage?.('Kategori berhasil dibuat!', 'success');
      // Reset form
      setFormData({
        name: '',
        description: ''
      });
    } catch (error: any) {
      console.error("Gagal membuat kategori:", error);
      showMessage?.(error.message || "Gagal membuat kategori.", 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
      <div className="bg-gradient-to-r from-green-600 to-green-800 p-6 text-white">
        <h3 className="text-2xl font-bold flex items-center">
          <RiListCheck2 className="mr-3" />
          Buat Kategori Baru
        </h3>
        <p className="text-green-100 mt-1">Tambahkan kategori pertandingan baru</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div>
          <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-2">
            Nama Kategori
          </label>
          <input
            type="text"
            id="categoryName"
            name="name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 text-gray-900 placeholder-gray-700" // text-gray-900, placeholder-gray-700
            placeholder="Contoh: Liga 1, Piala Dunia, dll"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="categoryDescription" className="block text-sm font-medium text-gray-700 mb-2">
            Deskripsi
          </label>
          <textarea
            id="categoryDescription"
            name="description"
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 text-gray-900 placeholder-gray-700" // text-gray-900, placeholder-gray-700
            placeholder="Deskripsi singkat tentang kategori ini"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className={`w-full py-3 px-4 bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold rounded-lg shadow-md hover:from-green-700 hover:to-green-600 transition duration-300 ease-in-out flex items-center justify-center ${
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
                Membuat...
              </>
            ) : (
              <>
                <RiAddLine className="mr-2" />
                Buat Kategori
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
