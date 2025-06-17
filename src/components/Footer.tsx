"use client";

import React from 'react';
import { RiFacebookFill, RiTwitterFill, RiInstagramFill, RiLinkedinFill } from 'react-icons/ri';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-gradient-to-r from-blue-900 to-blue-800 text-white py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-blue-100">
                Goalazoo
              </span>
            </h3>
            <p className="text-blue-100">
              Platform tiket pertandingan sepakbola terbaik di Indonesia. Temukan dan pesan tiket acara favorit Anda dengan mudah.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Tautan Cepat</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-blue-100 hover:text-white transition">Beranda</a></li>
              <li><a href="#" className="text-blue-100 hover:text-white transition">Pertandingan</a></li>
              <li><a href="#" className="text-blue-100 hover:text-white transition">Tentang Kami</a></li>
              <li><a href="#" className="text-blue-100 hover:text-white transition">Kontak</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Kontak Kami</h4>
            <ul className="space-y-2 text-blue-100">
              <li>Email: info@goalazoo.com</li>
              <li>Telepon: +62 123 4567 890</li>
              <li>Alamat: Jakarta, Indonesia</li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Media Sosial</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-blue-100 hover:text-white transition text-2xl">
                <RiFacebookFill />
              </a>
              <a href="#" className="text-blue-100 hover:text-white transition text-2xl">
                <RiTwitterFill />
              </a>
              <a href="#" className="text-blue-100 hover:text-white transition text-2xl">
                <RiInstagramFill />
              </a>
              <a href="#" className="text-blue-100 hover:text-white transition text-2xl">
                <RiLinkedinFill />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-blue-700 mt-8 pt-6 text-center text-blue-100">
          <p>&copy; {new Date().getFullYear()} Goalazoo. All Rights Reserved.</p>
          <div className="flex justify-center space-x-4 mt-2 text-xs">
            <a href="#" className="hover:text-white transition">Terms of Service</a>
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;