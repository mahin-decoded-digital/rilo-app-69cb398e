export interface BookingSlot {
  id: string;
  date: string;
  time: string;
  available: boolean;
}

export interface Booking {
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

export interface CreateBookingInput {
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
}