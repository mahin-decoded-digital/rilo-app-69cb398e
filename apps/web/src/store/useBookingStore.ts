import { create } from 'zustand';
import type { Booking, BookingSlot } from '@/types';
import { bookingApi } from '@/lib/api';

interface BookingState {
  // Calendar state
  selectedDate: string | null;
  selectedTime: string | null;
  availableSlots: BookingSlot[];
  slotsLoading: boolean;
  slotsError: string | null;

  // Booking form state
  bookingForm: {
    name: string;
    email: string;
    phone: string;
    service: string;
  };

  // Bookings history
  bookings: Booking[];
  bookingsLoading: boolean;
  bookingsError: string | null;

  // Booking submission
  bookingLoading: boolean;
  bookingError: string | null;

  // Step tracking (1: select date, 2: select time, 3: confirm)
  currentStep: number;

  // Actions
  setSelectedDate: (date: string | null) => void;
  setSelectedTime: (time: string | null) => void;
  setAvailableSlots: (slots: BookingSlot[]) => void;
  setBookingForm: (field: string, value: string) => void;
  resetBookingForm: () => void;
  setCurrentStep: (step: number) => void;
  fetchAvailableSlots: (date: string) => Promise<void>;
  fetchBookings: () => Promise<void>;
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  cancelBooking: (id: string) => Promise<void>;
}

export const useBookingStore = create<BookingState>()((set, get) => ({
  selectedDate: null,
  selectedTime: null,
  availableSlots: [],
  slotsLoading: false,
  slotsError: null,

  bookingForm: {
    name: '',
    email: '',
    phone: '',
    service: '',
  },

  bookings: [],
  bookingsLoading: false,
  bookingsError: null,

  bookingLoading: false,
  bookingError: null,

  currentStep: 1,

  setSelectedDate: (date) => {
    set({ selectedDate: date, selectedTime: null, currentStep: date ? 2 : 1 });
    if (date) {
      get().fetchAvailableSlots(date);
    } else {
      set({ availableSlots: [] });
    }
  },

  setSelectedTime: (time) => {
    set({ selectedTime: time, currentStep: time ? 3 : 2 });
  },

  setAvailableSlots: (slots) => set({ availableSlots: slots }),

  setBookingForm: (field, value) =>
    set((state) => ({
      bookingForm: { ...state.bookingForm, [field]: value },
    })),

  resetBookingForm: () =>
    set({
      bookingForm: { name: '', email: '', phone: '', service: '' },
      selectedDate: null,
      selectedTime: null,
      currentStep: 1,
      availableSlots: [],
      bookingError: null,
    }),

  setCurrentStep: (step) => set({ currentStep: step }),

  fetchAvailableSlots: async (date) => {
    set({ slotsLoading: true, slotsError: null });
    try {
      const slots = await bookingApi.getSlots(date);
      set({ availableSlots: slots, slotsLoading: false });
    } catch (error) {
      set({
        slotsError: error instanceof Error ? error.message : 'Failed to fetch slots',
        slotsLoading: false,
      });
    }
  },

  fetchBookings: async () => {
    set({ bookingsLoading: true, bookingsError: null });
    try {
      const bookings = await bookingApi.getAllBookings();
      set({ bookings, bookingsLoading: false });
    } catch (error) {
      set({
        bookingsError: error instanceof Error ? error.message : 'Failed to fetch bookings',
        bookingsLoading: false,
      });
    }
  },

  addBooking: async (bookingData) => {
    set({ bookingLoading: true, bookingError: null });
    try {
      const newBooking = await bookingApi.createBooking({
        name: bookingData.name,
        email: bookingData.email,
        phone: bookingData.phone,
        service: bookingData.service,
        date: bookingData.date,
        time: bookingData.time,
      });
      set((state) => ({
        bookings: [...state.bookings, newBooking],
        bookingLoading: false,
      }));
    } catch (error) {
      set({
        bookingError: error instanceof Error ? error.message : 'Failed to create booking',
        bookingLoading: false,
      });
      throw error;
    }
  },

  cancelBooking: async (id) => {
    try {
      const updatedBooking = await bookingApi.cancelBooking(id);
      set((state) => ({
        bookings: state.bookings.map((b) =>
          b.id === id ? updatedBooking : b
        ),
      }));
    } catch (error) {
      set({
        bookingsError: error instanceof Error ? error.message : 'Failed to cancel booking',
      });
    }
  },
}));