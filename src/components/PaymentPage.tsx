"use client";

import React, { useState, useEffect } from 'react';
import { Order, Event, Tribune, User } from '@/app/types';
import { updateOrderStatus, fetchEvents, fetchTribunesByEvent, fetchUsers } from '@/lib/api';
import { 
  RiTimeLine, 
  RiMoneyDollarCircleLine, 
  RiBankCardLine, 
  RiQrCodeLine, 
  RiCheckLine,
  RiCloseLine,
  RiFileCopyLine,
  RiTicketLine,
  RiTeamLine,
  RiCalendarEventLine,
  RiSteamLine
} from 'react-icons/ri';

interface PaymentPageProps {
  order: Order | null;
  showMessage: (msg: string, type: 'success' | 'error') => void;
  onPaymentComplete: (status: 'paid' | 'cancelled' | 'expired', orderId: number) => void;
}

const PaymentPage: React.FC<PaymentPageProps> = ({ order, showMessage, onPaymentComplete }) => {
  const [timeLeft, setTimeLeft] = useState(300);
  const [virtualAccountNumber, setVirtualAccountNumber] = useState('');
  const [barcodeData, setBarcodeData] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'paid' | 'cancelled' | 'expired'>('pending');
  const [eventDetails, setEventDetails] = useState<Event | null>(null);
  const [tribuneDetails, setTribuneDetails] = useState<Tribune | null>(null);
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [loadingDetails, setLoadingDetails] = useState<boolean>(true);

  useEffect(() => {
    const loadRequiredDetails = async () => {
      setLoadingDetails(true);
      if (order) {
        try {
          const [allEvents, allUsers] = await Promise.all([
            fetchEvents(),
            fetchUsers()
          ]);

          const event = allEvents.find(e => e.id === order.event_id);
          setEventDetails(event || null);

          const allTribunes = event ? await fetchTribunesByEvent(event.id) : [];
          const tribune = allTribunes.find(t => t.id === order.tribune_id);
          setTribuneDetails(tribune || null);

          const user = allUsers.find(u => u.id === order.user_id);
          setUserDetails(user || null);

          if (!event || !tribune || !user) {
            showMessage('Detail event, tribun, atau user tidak ditemukan untuk pesanan ini.', 'error');
            onPaymentComplete('cancelled', order.id);
            return;
          }

          setVirtualAccountNumber(generateVirtualAccountNumber(order.id));
          setBarcodeData(generateBarcodeData(order.id, parseFloat(order.total_price.toString())));
          setPaymentStatus(order.status);

        } catch (error: any) {
          console.error('Error loading order details for payment page:', error);
          showMessage('Gagal memuat detail pesanan.', 'error');
          onPaymentComplete('cancelled', order.id);
        } finally {
          setLoadingDetails(false);
        }
      } else {
        showMessage('Detail pesanan tidak valid.', 'error');
        onPaymentComplete('cancelled', -1);
        setLoadingDetails(false);
      }
    };

    loadRequiredDetails();

    if (order && order.status === 'pending') {
      const timer = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timer);
            if (paymentStatus === 'pending') {
              setPaymentStatus('expired');
              showMessage('Waktu pembayaran habis! Pesanan dibatalkan secara otomatis.', 'error');
              onPaymentComplete('expired', order.id);
            }
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
    return () => {};
  }, [order, onPaymentComplete, showMessage, paymentStatus]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const generateVirtualAccountNumber = (orderId: number) => {
    return `8888${String(orderId).padStart(7, '0')}12345`;
  };

  const generateBarcodeData = (orderId: number, totalPrice: number) => {
    return `PAY.QRIS.ORDER.${orderId}.AMT.${totalPrice.toFixed(2)}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      showMessage('Nomor VA berhasil disalin!', 'success');
    }).catch(err => {
      console.error('Gagal menyalin:', err);
      showMessage('Gagal menyalin nomor VA.', 'error');
    });
  };

  const handleConfirmPayment = async () => {
    if (!order) return;
    if (paymentStatus !== 'pending') {
      showMessage('Pembayaran tidak dalam status pending.', 'error');
      return;
    }
    if (!window.confirm('Apakah Anda yakin sudah melakukan pembayaran dan ingin mengkonfirmasi?')) {
      return;
    }

    try {
      const response = await updateOrderStatus(order.id, 'paid');
      showMessage(response.message || 'Pembayaran berhasil dikonfirmasi!', 'success');
      setPaymentStatus('paid');
      onPaymentComplete('paid', order.id);
    } catch (error: any) {
      console.error('Gagal konfirmasi pembayaran:', error);
      showMessage(error.message || 'Gagal konfirmasi pembayaran.', 'error');
    }
  };

  const handleCancelPayment = async () => {
    if (!order) return;
    if (paymentStatus !== 'pending') {
      showMessage('Pembayaran tidak dalam status pending atau sudah selesai.', 'error');
      return;
    }
    if (!window.confirm('Apakah Anda yakin ingin membatalkan pembayaran ini?')) {
      return;
    }

    try {
      const response = await updateOrderStatus(order.id, 'cancelled');
      showMessage(response.message || 'Pembayaran berhasil dibatalkan.', 'success');
      setPaymentStatus('cancelled');
      onPaymentComplete('cancelled', order.id);
    } catch (error: any) {
      console.error('Gagal batalkan pembayaran:', error);
      showMessage(error.message || 'Gagal batalkan pembayaran.', 'error');
    }
  };

  if (!order || loadingDetails) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!eventDetails || !tribuneDetails || !userDetails) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 text-center max-w-lg mx-auto">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
          <p className="font-medium">Data e-tiket tidak lengkap. Silakan kembali ke dashboard.</p>
        </div>
        <button
          onClick={() => onPaymentComplete('cancelled', order.id)}
          className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200"
        >
          Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
        <h2 className="text-2xl font-bold flex items-center justify-center">
          <RiMoneyDollarCircleLine className="mr-3" />
          Halaman Pembayaran
        </h2>
        <p className="text-blue-100 mt-1">Selesaikan pembayaran untuk pesanan tiket Anda</p>
      </div>

      <div className="p-6">
        {/* Order Summary */}
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
            <RiTicketLine className="mr-2" />
            Detail Pesanan
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start">
              <RiTeamLine className="mr-2 mt-0.5 text-blue-500 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-700">Pertandingan</p>
                <p className="text-gray-600">{eventDetails.team1_name} vs {eventDetails.team2_name}</p>
              </div>
            </div>
            <div className="flex items-start">
              <RiCalendarEventLine className="mr-2 mt-0.5 text-blue-500 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-700">Tanggal</p>
                <p className="text-gray-600">
                  {new Date(eventDetails.date).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <RiSteamLine className="mr-2 mt-0.5 text-blue-500 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-700">Tribun</p>
                <p className="text-gray-600">{tribuneDetails.name}</p>
                <p className="text-xs text-gray-500">
                  {order.quantity} tiket × Rp{tribuneDetails.price.toLocaleString('id-ID')}
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <RiMoneyDollarCircleLine className="mr-2 mt-0.5 text-blue-500 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-700">Total Pembayaran</p>
                <p className="text-blue-600 font-bold">
                  Rp{parseFloat(order.total_price.toString()).toLocaleString('id-ID')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Timer */}
        <div className={`p-4 rounded-lg mb-6 text-center ${
          paymentStatus === 'pending' ? 'bg-yellow-50 border border-yellow-200' :
          paymentStatus === 'paid' ? 'bg-green-50 border border-green-200' :
          paymentStatus === 'expired' || paymentStatus === 'cancelled' ? 'bg-red-50 border border-red-200' : ''
        }`}>
          <div className="flex items-center justify-center space-x-2 mb-2">
            <RiTimeLine className={`text-xl ${
              paymentStatus === 'pending' ? 'text-yellow-600' :
              paymentStatus === 'paid' ? 'text-green-600' :
              'text-red-600'
            }`} />
            <span className={`text-lg font-bold ${
              paymentStatus === 'pending' ? 'text-yellow-600' :
              paymentStatus === 'paid' ? 'text-green-600' :
              'text-red-600'
            }`}>
              {paymentStatus === 'pending' ? `Sisa Waktu: ${formatTime(timeLeft)}` :
               paymentStatus === 'paid' ? 'Pembayaran Berhasil!' :
               paymentStatus === 'expired' ? 'Waktu Pembayaran Habis' :
               'Pembayaran Dibatalkan'}
            </span>
          </div>
          {paymentStatus === 'pending' && (
            <p className="text-sm text-yellow-700">Selesaikan pembayaran sebelum waktu habis</p>
          )}
        </div>

        {/* Payment Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Virtual Account */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center mb-3">
              <RiBankCardLine className="text-blue-500 mr-2" />
              <h4 className="font-medium text-gray-800">Virtual Account</h4>
            </div>
            <div className="bg-white p-3 rounded border border-gray-300 mb-2">
              <p className="text-sm text-gray-600 mb-1">Nomor VA:</p>
              <div className="flex items-center justify-between">
                <span className="font-mono text-blue-800">{virtualAccountNumber}</span>
                <button
                  onClick={() => copyToClipboard(virtualAccountNumber)}
                  className="text-gray-500 hover:text-blue-600 transition-colors"
                  disabled={paymentStatus !== 'pending'}
                  title="Salin Nomor VA"
                >
                  <RiFileCopyLine />
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Gunakan nomor VA di atas untuk transfer melalui ATM/mobile banking
            </p>
          </div>

          {/* QRIS */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center mb-3">
              <RiQrCodeLine className="text-blue-500 mr-2" />
              <h4 className="font-medium text-gray-800">QRIS</h4>
            </div>
            <div className="flex flex-col items-center">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(barcodeData)}`}
                alt="QRIS Pembayaran"
                className="w-32 h-32 object-contain mb-2 border border-gray-300"
                onError={(e) => { e.currentTarget.src = 'https://placehold.co/150x150/cccccc/white?text=QRIS'; }}
              />
              <p className="text-xs text-gray-500 text-center">
                Scan QR code di atas menggunakan aplikasi mobile banking
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={handleCancelPayment}
            className={`flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition duration-300 ease-in-out shadow-md ${
              paymentStatus !== 'pending' ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
            } text-white`}
            disabled={paymentStatus !== 'pending'}
          >
            <RiCloseLine className="mr-2" />
            Batalkan Pembayaran
          </button>
          <button
            onClick={handleConfirmPayment}
            className={`flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition duration-300 ease-in-out shadow-md ${
              paymentStatus !== 'pending' ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
            } text-white`}
            disabled={paymentStatus !== 'pending'}
          >
            <RiCheckLine className="mr-2" />
            Konfirmasi Pembayaran
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;