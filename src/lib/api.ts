// src/lib/api.ts

import { Event, User, Order, Tribune, Category, ApiResponse, League } from '@/app/types'; // Import ApiResponse, League

const API_BASE_URL = typeof window !== 'undefined' ? window.location.origin : '';

async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Panggilan API gagal dengan status:', response.status, 'Teks respons:', errorText);
    let errorData: { error?: string };
    try {
      errorData = JSON.parse(errorText);
    } catch (parseError) {
      errorData = { error: `Kesalahan server (${response.status}): ${errorText.substring(0, 200)}...` };
    }
    throw new Error(errorData.error || `Panggilan API gagal dengan status: ${response.status}`);
  }
  return response.json();
}

// --- Event API Functions ---

export async function fetchEvents(): Promise<Event[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/events`, { cache: 'no-store' });
    return await handleApiResponse<Event[]>(response);
  } catch (error) {
    console.error('Kesalahan saat mengambil event:', error);
    throw error;
  }
}

export async function createEvent(
  eventData: Omit<Event, 'id' | 'created_at' | 'price' | 'available_tickets' | 'name'>
): Promise<Event> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });
    return await handleApiResponse<Event>(response);
  } catch (error) {
    console.error('Kesalahan dalam createEvent:', error);
    throw error;
  }
}

export async function updateEvent(
  id: number,
  eventData: Partial<Omit<Event, 'id' | 'created_at' | 'price' | 'available_tickets' | 'name'>>
): Promise<Event> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/events/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });
    return await handleApiResponse<Event>(response);
  } catch (error) {
    console.error(`Kesalahan saat memperbarui event dengan ID ${id}:`, error);
    throw error;
  }
}

export async function deleteEvent(id: number): Promise<{ message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/events/${id}`, {
      method: 'DELETE',
    });
    return await handleApiResponse<{ message: string }>(response);
  } catch (error) {
    console.error(`Kesalahan saat menghapus event dengan ID ${id}:`, error);
    throw error;
  }
}

// --- User API Functions ---

export async function fetchUsers(): Promise<User[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users`, { cache: 'no-store' });
    return await handleApiResponse<User[]>(response);
  } catch (error) {
    console.error('Kesalahan saat mengambil user:', error);
    throw error;
  }
}

export async function createUser(userData: Omit<User, 'id' | 'created_at'>): Promise<{ message: string; user?: User }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return await handleApiResponse<{ message: string; user?: User }>(response);
  } catch (error) {
    console.error('Kesalahan dalam createUser:', error);
    throw error;
  }
}

export async function updateUser(id: number, userData: Partial<Omit<User, 'id' | 'created_at' | 'password'>>): Promise<User> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return await handleApiResponse<User>(response);
  } catch (error) {
    console.error(`Kesalahan saat memperbarui user dengan ID ${id}:`, error);
    throw error;
  }
}

export async function deleteUser(id: number): Promise<{ message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
      method: 'DELETE',
    });
    return await handleApiResponse<{ message: string }>(response);
  } catch (error) {
    console.error(`Kesalahan saat menghapus user dengan ID ${id}:`, error);
    throw error;
  }
}

// --- Order API Functions ---

export async function fetchOrders(): Promise<Order[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/orders`, { cache: 'no-store' });
    return await handleApiResponse<Order[]>(response);
  } catch (error) {
    console.error('Kesalahan saat mengambil order:', error);
    throw error;
  }
}

export async function createOrder(orderData: Omit<Order, 'id' | 'order_date'>): Promise<Order> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    return await handleApiResponse<Order>(response);
  } catch (error) {
    console.error('Kesalahan dalam createOrder:', error);
    throw error;
  }
}

export async function updateOrderStatus(orderId: number, newStatus: 'pending' | 'paid' | 'cancelled'): Promise<{ message: string; order?: Order }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus }),
    });
    return await handleApiResponse<{ message: string; order?: Order }>(response);
  } catch (error) {
    console.error(`Kesalahan saat memperbarui status order ${orderId} ke ${newStatus}:`, error);
    throw error;
  }
}

export async function deleteOrder(id: number): Promise<{ message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/orders/${id}`, {
      method: 'DELETE',
    });
    return await handleApiResponse<{ message: string }>(response);
  } catch (error) {
    console.error(`Kesalahan saat menghapus order dengan ID ${id}:`, error);
    throw error;
  }
}

// --- Tribune API Functions ---

export async function fetchTribunesByEvent(eventId: number): Promise<Tribune[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tribunes?eventId=${eventId}`, { cache: 'no-store' });
    return await handleApiResponse<Tribune[]>(response);
  } catch (error) {
    console.error(`Kesalahan saat mengambil tribun untuk event ${eventId}:`, error);
    throw error;
  }
}

export async function createTribune(tribuneData: Omit<Tribune, 'id' | 'created_at'>): Promise<Tribune> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tribunes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tribuneData),
    });
    return await handleApiResponse<Tribune>(response);
  } catch (error) {
    console.error('Kesalahan dalam createTribune:', error);
    throw error;
  }
}

export async function updateTribune(id: number, tribuneData: Partial<Omit<Tribune, 'id' | 'created_at' | 'event_id'>>): Promise<Tribune> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tribunes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tribuneData),
    });
    return await handleApiResponse<Tribune>(response);
  } catch (error) {
    console.error(`Kesalahan saat memperbarui tribun dengan ID ${id}:`, error);
    throw error;
  }
}

export async function deleteTribune(id: number): Promise<{ message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tribunes/${id}`, {
      method: 'DELETE',
    });
    return await handleApiResponse<{ message: string }>(response);
  } catch (error) {
    console.error(`Kesalahan saat menghapus tribun dengan ID ${id}:`, error);
    throw error;
  }
}

// --- Category API Functions ---

export async function fetchCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/categories`, { cache: 'no-store' });
    return await handleApiResponse<Category[]>(response);
  } catch (error) {
    console.error('Kesalahan saat mengambil kategori:', error);
    throw error;
  }
}

export async function createCategory(categoryData: Omit<Category, 'id' | 'created_at'>): Promise<Category> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoryData),
    });
    return await handleApiResponse<Category>(response);
  } catch (error) {
    console.error('Kesalahan dalam createCategory:', error);
    throw error;
  }
}

export async function updateCategory(id: number, categoryData: Partial<Omit<Category, 'id' | 'created_at'>>): Promise<Category> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoryData),
    });
    return await handleApiResponse<Category>(response);
  } catch (error) {
    console.error(`Kesalahan saat memperbarui kategori dengan ID ${id}:`, error);
    throw error;
  }
}

export async function deleteCategory(id: number): Promise<{ message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
      method: 'DELETE',
    });
    return await handleApiResponse<{ message: string }>(response);
  } catch (error) {
    console.error(`Kesalahan saat menghapus kategori dengan ID ${id}:`, error);
    throw error;
  }
}

// --- Fungsi API untuk Statistik Dashboard Admin ---

export async function fetchAdminStats(): Promise<{
  totalEvents: number;
  totalUsers: number;
  totalOrders: number;
  totalCategories: number;
}> {
  try {
    const [events, users, orders, categories] = await Promise.all([
      fetchEvents(),
      fetchUsers(),
      fetchOrders(),
      fetchCategories(),
    ]);

    return {
      totalEvents: events.length,
      totalUsers: users.length,
      totalOrders: orders.length,
      totalCategories: categories.length,
    };
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    throw error;
  }
}

// --- Fungsi API Baru untuk Klasemen Liga ---

/**
 * Mengambil data klasemen liga dari API-Football melalui proxy backend.
 * @param leagueId ID liga (contoh: 39 untuk Premier League).
 * @param season Tahun musim (contoh: 2024).
 * @returns Objek League yang berisi data klasemen.
 */
export async function fetchLeagueStandings(leagueId: number, season: number): Promise<League> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/standings?league=${leagueId}&season=${season}`, {
      cache: 'no-store' // Pastikan data selalu baru
    });
    const data: ApiResponse = await handleApiResponse<ApiResponse>(response);

    if (data.response && data.response.length > 0) {
      return data.response[0].league;
    } else {
      throw new Error('Data klasemen tidak ditemukan atau API respons kosong.');
    }
  } catch (error) {
    console.error(`Kesalahan saat mengambil klasemen liga ${leagueId} musim ${season}:`, error);
    throw error;
  }
}
