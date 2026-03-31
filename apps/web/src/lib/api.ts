const API_BASE = '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};

// API response types
interface ApiResponse<T> {
  data: T;
}

interface BookingSlot {
  id: string;
  date: string;
  time: string;
  available: boolean;
}

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

interface CreateBookingInput {
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
}

// API functions for bookings
export const bookingApi = {
  getSlots: (date: string) =>
    api.get<BookingSlot[]>(`/slots/${date}`).then((res) => res.data),

  getAllBookings: () =>
    api.get<Booking[]>('/bookings').then((res) => res.data),

  createBooking: (input: CreateBookingInput) =>
    api.post<Booking>('/bookings', input).then((res) => res.data),

  cancelBooking: (id: string) =>
    api.delete<Booking>(`/bookings/${id}`).then((res) => res.data),
};