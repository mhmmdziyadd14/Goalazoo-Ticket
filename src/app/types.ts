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
  booking_code?: string;
  order_date?: string;
  status: 'pending' | 'paid' | 'cancelled';
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  created_at?: string;
}

// --- Tipe Data Baru untuk Klasemen Liga (API-Football) ---

export interface Team {
  id: number;
  name: string;
  logo: string;
}

export interface Goals {
  for: number;
  against: number;
}

export interface LeagueStats {
  played: number;
  win: number;
  draw: number;
  lose: number;
  goals: Goals;
}

export interface Standing {
  rank: number;
  team: Team;
  points: number;
  goalsDiff: number;
  group: string; // Misal: "Group A" atau "Total"
  form: string; // Misal: "WWLDD"
  status: string; // Misal: "same", "up", "down"
  description: string | null; // Misal: "Promotion - Champions League"
  all: LeagueStats;
  home: LeagueStats;
  away: LeagueStats;
  update: string;
}

export interface League {
  id: number;
  name: string;
  country: string;
  logo: string;
  flag: string;
  season: number;
  standings: Standing[][]; // Array of arrays, karena bisa ada grup
}

export interface ApiResponse {
  get: string;
  parameters: any;
  errors: any[];
  results: number;
  paging: {
    current: number;
    total: number;
  };
  response: {
    league: League;
  }[];
}
