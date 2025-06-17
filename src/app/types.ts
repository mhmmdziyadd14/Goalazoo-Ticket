// src/app/types.ts

import { ReactNode } from "react";

export interface User {
  id: number;
  username: string;
  email: string;
  password?: string;
  role: 'user' | 'admin';
  created_at?: string;
}

export interface Event {
  tickets_available: ReactNode;
  category: ReactNode;
  id: number;
  team1_name: string;
  team2_name: string;
  team1_logo_url?: string;
  team2_logo_url?: string;
  description?: string;
  date: string;
  location: string;
  category_id: number;
  created_at?: string;
}

export interface Tribune {
  id: number;
  event_id: number;
  name: string;
  price: number;
  available_seats: number;
  created_at?: string;
}

export interface Order {
  id: number;
  user_id: number;
  event_id: number;
  tribune_id?: number;
  quantity: number;
  total_price: number;
  booking_code?: string; // Tambahkan booking_code
  order_date?: string;
  status: 'pending' | 'paid' | 'cancelled';
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  created_at?: string;
}
