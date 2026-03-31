import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useBookingStore } from '@/store/useBookingStore';
import { Calendar, Clock, CheckCircle, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';

const SERVICES_LIST = [
  'Cloud Infrastructure',
  'Cybersecurity',
  'Software Development',
  'Data Analytics',
  'IT Consulting',
  'DevOps Services',
];

export default function CalendarWidget() {
  const {
    selectedDate,
    selectedTime,
    availableSlots,
    bookingForm,
    currentStep,
    bookingLoading,
    bookingError,
    setSelectedDate,
    setSelectedTime,
    setBookingForm,
    resetBookingForm,
    addBooking,
  } = useBookingStore();

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days: (number | null)[] = [];
    // Add empty slots for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  }, [currentMonth]);

  const getDateString = (day: number) => {
    const year = currentMonth.getFullYear();
    const month = (currentMonth.getMonth() + 1).toString().padStart(2, '0');
    const dayStr = day.toString().padStart(2, '0');
    return `${year}-${month}-${dayStr}`;
  };

  const isDateSelectable = (day: number) => {
    const today = new Date();
    const dateStr = getDateString(day);
    const date = new Date(dateStr);
    // Can't select past dates or weekends
    return date >= today && date.getDay() !== 0 && date.getDay() !== 6;
  };

  const handleDateClick = (day: number) => {
    if (isDateSelectable(day)) {
      setSelectedDate(getDateString(day));
    }
  };

  const handleTimeClick = (time: string) => {
    setSelectedTime(time);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDate && selectedTime && bookingForm.name && bookingForm.email) {
      try {
        await addBooking({
          name: bookingForm.name,
          email: bookingForm.email,
          phone: bookingForm.phone,
          service: bookingForm.service,
          date: selectedDate,
          time: selectedTime,
        });
        setShowConfirmation(true);
        setTimeout(() => {
          resetBookingForm();
          setShowConfirmation(false);
        }, 3000);
      } catch {
        // Error is handled in the store, UI will react to bookingError
      }
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  if (showConfirmation) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Booking Confirmed!</h3>
          <p className="text-muted-foreground">
            Your consultation has been scheduled for{' '}
            <span className="font-semibold">{selectedDate} at {selectedTime}</span>
          </p>
          <p className="text-muted-foreground mt-2">
            We've sent a confirmation email to <span className="font-semibold">{bookingForm.email}</span>
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Schedule a Consultation
        </CardTitle>
        <CardDescription>
          Step {currentStep} of 3: {currentStep === 1 ? 'Select a date' : currentStep === 2 ? 'Choose a time' : 'Confirm details'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          {/* Error Alert */}
          {bookingError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              <AlertCircle className="w-4 h-4" />
              {bookingError}
            </div>
          )}

          {/* Progress Steps */}
          <div className="flex justify-between items-center">
            {['Date', 'Time', 'Confirm'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep > index + 1
                      ? 'bg-primary text-primary-foreground'
                      : currentStep === index + 1
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {currentStep > index + 1 ? <CheckCircle className="w-4 h-4" /> : index + 1}
                </div>
                {index < 2 && (
                  <div
                    className={`w-12 sm:w-20 h-0.5 mx-2 ${
                      currentStep > index + 1 ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Date Selection */}
          {currentStep >= 1 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                  className="p-2 hover:bg-muted rounded-md"
                  disabled={currentMonth <= new Date()}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h4 className="font-semibold">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h4>
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                  className="p-2 hover:bg-muted rounded-md"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-xs font-medium text-muted-foreground p-2">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => (
                  <button
                    key={index}
                    onClick={() => day && handleDateClick(day)}
                    disabled={!day || !isDateSelectable(day)}
                    className={`p-2 text-sm rounded-md transition-colors ${
                      !day
                        ? 'invisible'
                        : !isDateSelectable(day)
                        ? 'text-muted-foreground/50 cursor-not-allowed'
                        : selectedDate === getDateString(day)
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
              {selectedDate && (
                <p className="mt-3 text-sm text-primary font-medium">
                  Selected: {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              )}
            </div>
          )}

          {/* Step 2: Time Selection */}
          {currentStep >= 2 && selectedDate && (
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Available Times
              </h4>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {availableSlots
                  .filter((slot) => slot.available)
                  .map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => handleTimeClick(slot.time)}
                      className={`p-2 text-sm rounded-md border transition-colors ${
                        selectedTime === slot.time
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'hover:bg-muted border-input'
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
              </div>
              {availableSlots.filter((s) => s.available).length === 0 && (
                <p className="text-muted-foreground text-sm">No available slots for this date.</p>
              )}
            </div>
          )}

          {/* Step 3: Confirmation Form */}
          {currentStep >= 3 && selectedDate && selectedTime && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h4 className="font-semibold">Your Details</h4>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium mb-1 block">Name *</label>
                  <input
                    type="text"
                    required
                    value={bookingForm.name}
                    onChange={(e) => setBookingForm('name', e.target.value)}
                    className="w-full p-2 border border-input rounded-md bg-background"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Email *</label>
                  <input
                    type="email"
                    required
                    value={bookingForm.email}
                    onChange={(e) => setBookingForm('email', e.target.value)}
                    className="w-full p-2 border border-input rounded-md bg-background"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Phone</label>
                  <input
                    type="tel"
                    value={bookingForm.phone}
                    onChange={(e) => setBookingForm('phone', e.target.value)}
                    className="w-full p-2 border border-input rounded-md bg-background"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Service</label>
                  <select
                    value={bookingForm.service}
                    onChange={(e) => setBookingForm('service', e.target.value)}
                    className="w-full p-2 border border-input rounded-md bg-background"
                  >
                    <option value="">Select a service</option>
                    {SERVICES_LIST.map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm">
                  <strong>Appointment Summary:</strong>
                </p>
                <p className="text-sm text-muted-foreground">
                  {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} at {selectedTime}
                </p>
              </div>
              <Button type="submit" className="w-full" disabled={bookingLoading}>
                {bookingLoading ? 'Confirming...' : 'Confirm Booking'}
              </Button>
            </form>
          )}
        </div>
      </CardContent>
    </Card>
  );
}