"use client";

import React, { useState, useEffect } from 'react';
import { Category } from '@/app/types';
import { fetchCategories, deleteCategory, updateCategory } from '@/lib/api';
import { RiEditLine, RiDeleteBinLine, RiCloseLine, RiCheckLine, RiListCheck2, RiLoader4Line } from 'react-icons/ri'; // Tambahkan RiLoader4Line untuk loading state

interface CategoryListProps {
  showMessage: (msg: string, type: 'success' | 'error') => void;
}

const CategoryList: React.FC<CategoryListProps> = ({ showMessage }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false); // State untuk status update

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (error: any) {
      showMessage(error.message || 'Gagal memuat kategori.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus kategori ini? Jika ada event yang terkait, ini akan gagal.')) {
      try {
        await deleteCategory(id);
        showMessage('Kategori berhasil dihapus!', 'success');
        loadCategories(); // Muat ulang kategori setelah penghapusan
      } catch (error: any) {
        showMessage(error.message || 'Gagal menghapus kategori.', 'error');
      }
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory({ ...category });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    setIsUpdating(true); // Mulai loading update
    try {
      const updatedData: Partial<Omit<Category, 'id' | 'created_at'>> = {
        name: editingCategory.name,
        description: editingCategory.description,
      };
      await updateCategory(editingCategory.id, updatedData);
      showMessage('Kategori berhasil diperbarui!', 'success');
      setEditingCategory(null); // Keluar dari mode edit
      loadCategories(); // Muat ulang kategori setelah update
    } catch (error: any) {
      showMessage(error.message || 'Gagal memperbarui kategori.', 'error');
    } finally {
      setIsUpdating(false); // Hentikan loading update
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-green-600 to-green-800 p-6 text-white">
        <h3 className="text-2xl font-bold flex items-center">
          <RiListCheck2 className="mr-3" />
          Daftar Kategori
        </h3>
        <p className="text-green-100 mt-1">Kelola semua kategori pertandingan</p>
      </div>

      <div className="p-6">
        {categories.length === 0 ? (
          <div className="text-center py-8">
            <RiListCheck2 className="mx-auto text-4xl text-gray-400 mb-4" />
            <p className="text-gray-600">Tidak ada kategori yang tersedia.</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {categories.map((category) => (
              <div key={category.id} className="bg-gray-50 rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {editingCategory?.id === category.id ? (
                  // Edit Form
                  <form onSubmit={handleUpdate} className="p-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kategori</label>
                      <input
                        type="text"
                        value={editingCategory.name}
                        onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 text-gray-900 placeholder-gray-700" // text-gray-900, placeholder-gray-700
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                      <textarea
                        value={editingCategory.description || ''}
                        onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 text-gray-900 placeholder-gray-700" // text-gray-900, placeholder-gray-700
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setEditingCategory(null)}
                        className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200"
                      >
                        <RiCloseLine className="mr-2" /> Batal
                      </button>
                      <button
                        type="submit"
                        className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200 disabled:opacity-70"
                        disabled={isUpdating}
                      >
                        {isUpdating ? (
                          <RiLoader4Line className="animate-spin" />
                        ) : (
                          <RiCheckLine className="mr-2" />
                        )}
                        Simpan
                      </button>
                    </div>
                  </form>
                ) : (
                  // Display Mode
                  <div className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-lg text-gray-800">{category.name}</h4>
                        {category.description && (
                          <p className="text-gray-600 mt-1 text-sm">{category.description}</p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Edit"
                        >
                          <RiEditLine />
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Hapus"
                        >
                          <RiDeleteBinLine />
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
    </div>
  );
};

export default CategoryList;
