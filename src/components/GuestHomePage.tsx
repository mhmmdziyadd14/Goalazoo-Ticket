"use client";

import React, { useState, useEffect } from 'react';
import { fetchEvents, fetchCategories } from '@/lib/api';
import { Event, Category } from '@/app/types';
import {
  RiFootballFill,
  RiCalendarEventFill,
  RiMapPinFill,
  RiTicket2Fill,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiLoader5Fill
} from 'react-icons/ri';
import Footer from './Footer'; // Pastikan import Footer

interface GuestHomePageProps {
  setCurrentView: React.Dispatch<React.SetStateAction<'login' | 'register' | 'user' | 'admin' | 'guest' | 'payment' | 'forgot-password'>>;
}

const GuestHomePage: React.FC<GuestHomePageProps> = ({ setCurrentView }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingEvents, setLoadingEvents] = useState<boolean>(true);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselImages = [
    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1522778119026-d647f0596c20?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80',
  ];

  useEffect(() => {
    const loadData = async () => {
      setLoadingEvents(true);
      setLoadingCategories(true);
      try {
        const eventData = await fetchEvents();
        setEvents(eventData);

        const categoryData = await fetchCategories();
        setCategories(categoryData);
      } catch (error) {
        console.error('Gagal memuat data:', error);
      } finally {
        setLoadingEvents(false);
        setLoadingCategories(false);
      }
    };
    loadData();

    const slideInterval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % carouselImages.length);
    }, 5000);

    return () => clearInterval(slideInterval);
  }, [carouselImages.length]);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Tidak Dikenal';
  };

  return (
    <div className="w-full bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen py-8 flex flex-col">
      {/* Hero Section */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-grow">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-8 md:p-12 text-white shadow-2xl mb-12 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-4">
              <RiFootballFill className="text-4xl mr-3 animate-bounce" />
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                Selamat Datang di <span className="text-yellow-300">Goalazoo!</span>
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8">
              Temukan dan pesan tiket pertandingan sepak bola favorit Anda dengan mudah dan cepat.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => setCurrentView('login')}
                className="px-6 py-3 bg-white text-blue-700 font-bold rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
              >
                Masuk Sekarang
              </button>
              <button
                onClick={() => setCurrentView('register')}
                className="px-6 py-3 bg-yellow-400 text-gray-900 font-bold rounded-lg hover:bg-yellow-300 transition-all transform hover:scale-105 shadow-lg"
              >
                Daftar Akun Baru
              </button>
            </div>
          </div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-400 rounded-full opacity-20"></div>
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-yellow-400 rounded-full opacity-20"></div>
        </div>

        {/* Carousel */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-16 group">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {carouselImages.map((image, index) => (
              <div key={index} className="w-full flex-shrink-0 relative">
                <img
                  src={image}
                  alt={`Carousel Slide ${index + 1}`}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-8">
                  <div className="text-white">
                    <RiFootballFill className="text-4xl mb-2" />
                    <h3 className="text-2xl font-bold mb-1">Pengalaman Baru di Stadion</h3>
                    <p className="text-blue-200">Jangan lewatkan momen spesial ini!</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Carousel Controls */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <RiArrowLeftSLine className="text-3xl" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <RiArrowRightSLine className="text-3xl" />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
            {carouselImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-3 w-3 rounded-full transition-all duration-300 ${currentSlide === index ? 'bg-yellow-400 w-6' : 'bg-white/50'}`}
              ></button>
            ))}
          </div>
        </div>

        {/* Upcoming Matches */}
        <div className="mb-16">
          <div className="flex items-center justify-center mb-8">
            <RiCalendarEventFill className="text-3xl text-blue-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-800">Jadwal Pertandingan</h2>
          </div>

          {loadingEvents || loadingCategories ? (
            <div className="flex justify-center items-center py-16">
              <RiLoader5Fill className="animate-spin text-4xl text-blue-600" />
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
              <RiFootballFill className="text-5xl text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-gray-600">Tidak ada pertandingan mendatang yang tersedia saat ini.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <div key={event.id} className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
                  <div className="relative h-48 bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center">
                    <RiFootballFill className="text-8xl text-white/20 absolute right-4 bottom-4" />
                    <div className="flex items-center justify-center space-x-6 z-10">
                      {event.team1_logo_url && (
                        <img
                          src={event.team1_logo_url}
                          alt={`${event.team1_name} Logo`}
                          className="w-16 h-16 object-contain bg-white p-1 rounded-full"
                          onError={(e) => (e.currentTarget.src = 'https://placehold.co/64x64/cccccc/white?text=Logo')}
                        />
                      )}
                      <span className="text-white font-bold text-xl">VS</span>
                      {event.team2_logo_url && (
                        <img
                          src={event.team2_logo_url}
                          alt={`${event.team2_name} Logo`}
                          className="w-16 h-16 object-contain bg-white p-1 rounded-full"
                          onError={(e) => (e.currentTarget.src = 'https://placehold.co/64x64/cccccc/white?text=Logo')}
                        />
                      )}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{event.team1_name} vs {event.team2_name}</h3>
                        <p className="text-sm text-blue-600 font-medium">{getCategoryName(event.category_id)}</p>
                      </div>
                      {/* Anda bisa menambahkan badge tiket di sini, jika data tersedia dari event */}
                      {/* <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                        {event.tickets_available} Tiket Tersedia
                      </span> */}
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center">
                        <RiCalendarEventFill className="text-gray-500 mr-2" />
                        <span className="text-gray-700">
                          {new Date(event.date).toLocaleString('id-ID', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <RiMapPinFill className="text-gray-500 mr-2" />
                        <span className="text-gray-700">{event.location}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setCurrentView('login')}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-900 transition-all"
                    >
                      <RiTicket2Fill />
                      Lihat Tiket
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-3xl p-8 text-center shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Siap Menonton Pertandingan Langsung?</h3>
          <p className="text-gray-800 mb-6 max-w-2xl mx-auto">
            Bergabunglah dengan ribuan penggemar lainnya dan dapatkan pengalaman menonton yang tak terlupakan!
          </p>
          <button
            onClick={() => setCurrentView('register')}
            className="px-8 py-3 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition-all transform hover:scale-105 shadow-lg"
          >
            Daftar Sekarang Gratis
          </button>
        </div>
        {/* Footer dimasukkan di sini */}
        <div className="w-full max-w-7xl mx-auto mt-12"> {/* mx-auto untuk memusatkan footer */}
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default GuestHomePage;