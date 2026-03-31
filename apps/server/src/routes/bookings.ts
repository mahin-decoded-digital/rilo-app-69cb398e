import { Router } from 'express';
import { db } from '../lib/db';
import type { Booking, BookingSlot, CreateBookingInput } from '../models/booking';

const router = Router();

// Generate available slots for a date
function generateSlotsForDate(date: string): BookingSlot[] {
  const slots: BookingSlot[] = [];
  for (let hour = 9; hour <= 17; hour++) {
    const times = [`${hour.toString().padStart(2, '0')}:00`, `${hour.toString().padStart(2, '0')}:30`];
    for (const time of times) {
      // In production, check against actual bookings
      // For now, randomly mark some slots unavailable (30% taken)
      const available = Math.random() > 0.3;
      slots.push({
        id: `${date}-${time}`,
        date,
        time,
        available,
      });
    }
  }
  return slots;
}

// GET /api/slots/:date - Get available slots for a specific date
router.get('/slots/:date', async (req, res) => {
  try {
    const { date } = req.params;
    
    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
    }

    const bookingsCollection = db.collection('bookings');
    
    // Get bookings for this date that are not cancelled
    const existingBookings = (await bookingsCollection.find({ date, status: { $ne: 'cancelled' } })) as unknown as Booking[];
    const bookedTimes = new Set(existingBookings.map(b => b.time));
    
    // Generate slots and mark booked times as unavailable
    const allSlots = generateSlotsForDate(date);
    const slots = allSlots.map(slot => ({
      ...slot,
      available: slot.available && !bookedTimes.has(slot.time),
    }));

    res.json({ data: slots });
  } catch (error) {
    console.error('[slots] Error:', error);
    res.status(500).json({ error: 'Failed to fetch slots' });
  }
});

// GET /api/bookings - Get all bookings
router.get('/bookings', async (_req, res) => {
  try {
    const bookingsCollection = db.collection('bookings');
    const bookings = await bookingsCollection.find();
    res.json({ data: bookings });
  } catch (error) {
    console.error('[bookings] Error:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// POST /api/bookings - Create a new booking
router.post('/bookings', async (req, res) => {
  try {
    const { name, email, phone, service, date, time } = req.body as CreateBookingInput;

    // Validate required fields
    if (!name || !email || !phone || !service || !date || !time) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Check if slot is available
    const bookingsCollection = db.collection('bookings');
    const existingBooking = await bookingsCollection.findOne({ date, time, status: { $ne: 'cancelled' } });
    
    if (existingBooking) {
      return res.status(409).json({ error: 'This time slot is no longer available' });
    }

    // Create the booking
    const booking: Booking = {
      id: Math.random().toString(36).slice(2, 11),
      name,
      email,
      phone,
      service,
      date,
      time,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    await bookingsCollection.insertOne(booking as any);
    res.status(201).json({ data: booking });
  } catch (error) {
    console.error('[bookings] Error:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// DELETE /api/bookings/:id - Cancel a booking
router.delete('/bookings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: 'Booking ID is required' });
    }

    const bookingsCollection = db.collection('bookings');
    const booking = await bookingsCollection.findById(id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Soft delete - update status to cancelled
    const updated = await bookingsCollection.updateOne(id, { status: 'cancelled' });

    if (updated) {
      res.json({ data: { ...booking, status: 'cancelled' } });
    } else {
      res.status(500).json({ error: 'Failed to cancel booking' });
    }
  } catch (error) {
    console.error('[bookings] Error:', error);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
});

export default router;