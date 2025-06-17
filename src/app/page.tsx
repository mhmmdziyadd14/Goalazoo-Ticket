"use client"; // This component runs on the client side

import React, { useState, useEffect } from 'react';
import AdminPage from '@/app/admin/page';
import UserPage from '@/app/user/page';
import LoginPage from '@/components/LoginPage';
import RegisterPage from '@/components/RegisterPage';
import GuestHomePage from '@/components/GuestHomePage';
import Navbar from '@/components/Navbar';
import PaymentPage from '@/components/PaymentPage';
import ForgotPasswordPage from '@/components/ForgotPasswordPage'; // Import komponen ForgotPasswordPage
import Footer from '@/components/Footer';
import { User, Order } from '@/app/types';

const App = () => {
  // --- PERBAIKAN DI SINI ---
  // Pastikan tipe ini mencakup SEMUA tampilan yang mungkin.
  const [currentView, setCurrentView] = useState<'login' | 'register' | 'user' | 'admin' | 'guest' | 'payment' | 'forgot-password'>('guest');
  // --- AKHIR PERBAIKAN ---

  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [orderToPay, setOrderToPay] = useState<Order | null>(null);
  const [message, setMessage] = useState<string>('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  const showMessage = (msg: string, type: 'success' | 'error') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${window.location.origin}/api/auth/login`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Pemeriksaan autentikasi gagal dengan status:', response.status, 'Teks respons:', errorText);
          setIsAuthenticated(false);
          setCurrentView('guest');
          return;
        }

        const data = await response.json();

        if (data.isAuthenticated) {
          setIsAuthenticated(true);
          setUser(data.user as User);
          if (data.user && (data.user as User).role === 'admin') {
            setCurrentView('admin');
          } else {
            setCurrentView('user');
          }
        } else {
          setCurrentView('guest');
        }
      } catch (error) {
        console.error('Kesalahan memeriksa autentikasi:', error);
        setIsAuthenticated(false);
        setCurrentView('guest');
        showMessage('Kesalahan jaringan saat memeriksa autentikasi.', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${window.location.origin}/api/auth/logout`, {
        method: 'POST',
      });
      if (response.ok) {
        setIsAuthenticated(false);
        setUser(null);
        setCurrentView('guest');
        showMessage('Logout berhasil!', 'success');
      } else {
        const errorText = await response.text();
        console.error('Logout failed with status:', response.status, 'Response text:', errorText);
        showMessage('Logout gagal.', 'error');
      }
    } catch (error) {
      console.error('Logout error:', error);
      showMessage('Logout gagal karena kesalahan jaringan.', 'error');
    }
  };

  const handleInitiatePayment = (order: Order) => {
    setOrderToPay(order);
    setCurrentView('payment');
  };

  const handlePaymentComplete = (status: 'paid' | 'cancelled' | 'expired', orderId: number) => {
    setOrderToPay(null);
    if (isAuthenticated) {
      setCurrentView('user');
    } else {
      setCurrentView('guest');
    }
    if (status === 'paid') {
      showMessage('Pembayaran Anda berhasil!', 'success');
    } else if (status === 'cancelled') {
      showMessage('Pembayaran Anda dibatalkan.', 'error');
    } else if (status === 'expired') {
      showMessage('Waktu pembayaran habis. Pesanan dibatalkan.', 'error');
    }
  };


  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="text-xl font-semibold text-gray-700">Memuat...</div>
        </div>
      );
    }

    switch (currentView) {
      case 'guest':
        return <GuestHomePage setCurrentView={setCurrentView} />;
      case 'login':
        return <LoginPage setCurrentView={setCurrentView} setIsAuthenticated={setIsAuthenticated} setUser={setUser} showMessage={showMessage} />;
      case 'register':
        return <RegisterPage setCurrentView={setCurrentView} showMessage={showMessage} />;
      case 'admin':
        return <AdminPage user={user} handleLogout={handleLogout} showMessage={showMessage} />;
      case 'user':
        return <UserPage user={user} handleLogout={handleLogout} showMessage={showMessage} onInitiatePayment={handleInitiatePayment} />;
      case 'payment':
        return <PaymentPage order={orderToPay} showMessage={showMessage} onPaymentComplete={handlePaymentComplete} />;
      case 'forgot-password':
        return <ForgotPasswordPage setCurrentView={setCurrentView} showMessage={showMessage} />;
      default:
        return <GuestHomePage setCurrentView={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar user={user} handleLogout={handleLogout} setCurrentView={setCurrentView} />

      <div className="flex-1 pt-16 flex items-center justify-center">
        {renderContent()}
      </div>

     

      {message && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg text-white z-50 ${messageType === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default App;
