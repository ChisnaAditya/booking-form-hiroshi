import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

function RestaurantBookingForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showMap, setShowMap] = useState(true);
  const [errors, setErrors] = useState({});
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    guestCount: 1,
    address: '',
    foodAllergies: '',
  });

  // Available time slots with remaining spots
  const timeSlots = [
    { time: '5:00 PM', spotsLeft: 1 },
    { time: '7:30 PM', spotsLeft: 1 },
    { time: '9:30 PM', spotsLeft: 2 },
  ];

  // Get days in month for calendar
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  // Get calendar array for current month view
  const getCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    // Previous month days to display
    const prevMonthDays = [];
    if (firstDayOfMonth > 0) {
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevMonthYear = month === 0 ? year - 1 : year;
      const daysInPrevMonth = getDaysInMonth(prevMonthYear, prevMonth);
      
      for (let i = firstDayOfMonth - 1; i >= 0; i--) {
        prevMonthDays.push({
          day: daysInPrevMonth - i,
          month: prevMonth,
          year: prevMonthYear,
          isCurrentMonth: false
        });
      }
    }
    
    // Current month days
    const currentMonthDays = [];
    for (let i = 1; i <= daysInMonth; i++) {
      currentMonthDays.push({
        day: i,
        month,
        year,
        isCurrentMonth: true
      });
    }
    
    // Next month days to display (to fill the calendar grid)
    const nextMonthDays = [];
    const totalDaysDisplayed = prevMonthDays.length + currentMonthDays.length;
    const remainingDays = 42 - totalDaysDisplayed; // 6 rows of 7 days
    
    if (remainingDays > 0) {
      const nextMonth = month === 11 ? 0 : month + 1;
      const nextMonthYear = month === 11 ? year + 1 : year;
      
      for (let i = 1; i <= remainingDays; i++) {
        nextMonthDays.push({
          day: i,
          month: nextMonth,
          year: nextMonthYear,
          isCurrentMonth: false
        });
      }
    }
    
    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  };

  // Format calendar day as ISO date string
  const formatDateToISOString = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  // Format date for display
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Get month name and year for calendar header
  const getMonthYearString = () => {
    return currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Handle day selection in the calendar
  const handleDayClick = (day) => {
    const isoDate = formatDateToISOString(day.year, day.month, day.day);
    setFormData({
      ...formData,
      date: isoDate,
    });
    
    // Clear date error if it exists
    if (errors.date) {
      setErrors({
        ...errors,
        date: '',
      });
    }
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error for this field when user changes it
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  // Handle time selection
  const handleTimeSelect = (time) => {
    setFormData({
      ...formData,
      time,
    });
    
    // Clear time error if it exists
    if (errors.time) {
      setErrors({
        ...errors,
        time: '',
      });
    }
  };

  // Validate form fields for current step
  const validateStep = () => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!formData.date) newErrors.date = 'Please select a date';
      if (!formData.time) newErrors.time = 'Please select a time';
    } else if (currentStep === 2) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email address is invalid';
      if (!formData.address.trim()) newErrors.address = 'Address is required';
      if (formData.guestCount < 1) newErrors.guestCount = 'Guest count must be at least 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next step
  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Handle back step
  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateStep()) {
      // Log the form data
      console.log('Form submitted with data:', formData);
      
      // Show success message
      setShowSuccess(true);
    }
  };

  // Check if a date is today
  const isToday = (calendarDay) => {
    const today = new Date();
    return (
      calendarDay.day === today.getDate() &&
      calendarDay.month === today.getMonth() &&
      calendarDay.year === today.getFullYear()
    );
  };

  // Check if a date is selected
  const isSelectedDate = (calendarDay) => {
    if (!formData.date) return false;
    
    const selectedDate = new Date(formData.date);
    return (
      calendarDay.day === selectedDate.getDate() &&
      calendarDay.month === selectedDate.getMonth() &&
      calendarDay.year === selectedDate.getFullYear()
    );
  };

  // Check if date is in the past
  const isPastDate = (calendarDay) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const calDate = new Date(calendarDay.year, calendarDay.month, calendarDay.day);
    return calDate < today;
  };

  // Day of week headers
  const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="max-w-2xl w-full">
        <h1 className="text-2xl text-white font-bold uppercase px-4 py-2 bg-red-800">APPOINTMENT</h1>
        
        {/* Map Section */}
        <div className="bg-white p-4 border-t-2 border-red-800 relative mb-2">
          {showMap && (
            <>
              <div className="flex justify-between">
                <div>
                  <h2 className="text-lg font-medium">North Ohio with North Ohio</h2>
                  <p className="text-sm text-gray-600">1 hour 30 minutes</p>
                </div>
                <button 
                  onClick={() => setShowMap(false)}
                  className="text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="mt-4 flex">
                <div className="w-1/3 pr-4">
                  <div className="border border-gray-300 rounded p-1">
                    <img src="/api/placeholder/240/160" alt="Ohio Map" className="w-full" />
                  </div>
                </div>
                <div className="w-2/3">
                  <p className="text-xs text-gray-700 leading-tight">
                    Williams, Fulton, Defiance, Paulding, Henry, Putnam, Van Wert, Allen, Lucas, Wood, Hancock, 
                    Ottawa, Sandusky, Seneca, Erie, Huron, Lake, Ashtabula, Lorain, Cuyahoga, Geauga, Portage, 
                    Trumbull, Medina, Smmhit, Mahoning, Ashland, Crawford, ...
                  </p>
                  <button className="mt-2 text-xs text-blue-600 uppercase font-medium">Show All</button>
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Calendar Section */}
        <div className="bg-white p-4 border-t-2 border-red-800 border-b-2 relative mb-2">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={goToPreviousMonth}
              type="button"
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <ChevronLeft className="h-5 w-5 text-gray-500" />
            </button>
            <h4 className="text-lg font-medium text-gray-900">{getMonthYearString()}</h4>
            <button
              onClick={goToNextMonth}
              type="button"
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <ChevronRight className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          
          {/* Weekday headers */}
          <div className="grid grid-cols-7 mb-1">
            {weekdays.map((day) => (
              <div key={day} className="text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {getCalendarDays().map((day, index) => {
              const isSelected = isSelectedDate(day);
              const isCurrentDay = isToday(day);
              const isPast = isPastDate(day);
              
              return (
                <button
                  key={index}
                  type="button"
                  disabled={isPast || !day.isCurrentMonth}
                  onClick={() => handleDayClick(day)}
                  className={`
                    h-10 w-full rounded flex items-center justify-center text-sm
                    ${!day.isCurrentMonth ? 'text-gray-300' : ''}
                    ${isPast && day.isCurrentMonth ? 'text-gray-400 cursor-not-allowed' : ''}
                    ${isSelected ? 'bg-red-800 text-white font-medium' : ''}
                    ${isCurrentDay && !isSelected ? 'border border-red-800 text-red-800' : ''}
                    ${!isPast && day.isCurrentMonth && !isSelected && !isCurrentDay ? 'hover:bg-gray-100' : ''}
                  `}
                >
                  {day.day}
                </button>
              );
            })}
          </div>
          
          {/* Time zone */}
          {formData.date && (
            <div className="mt-6">
              <p className="text-sm text-gray-700 uppercase font-medium">Time Zone: Eastern Time (GMT-04:00)</p>
            </div>
          )}
        </div>
        
        {/* Time Selection Section */}
        {formData.date && (
          <div className="bg-white p-4 border-t-2 border-red-800 mb-2">
            <h4 className="mb-4 text-base font-medium text-gray-900">Saturday, May 17</h4>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((slot) => (
                <button
                  key={slot.time}
                  type="button"
                  onClick={() => handleTimeSelect(slot.time)}
                  className={`
                    border ${formData.time === slot.time ? 'border-red-800 bg-red-50' : 'border-gray-300'} 
                    px-3 py-2 text-center rounded
                  `}
                >
                  <div className="font-medium text-gray-900">{slot.time}</div>
                  <div className="text-xs text-gray-500">
                    {slot.spotsLeft === 1 
                      ? '1 spot left' 
                      : `${slot.spotsLeft} spots left`}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Customer Details Section */}
        {formData.time && (
          <div className="bg-white p-4 border-t-2 border-red-800 mb-2">
            <h4 className="text-base font-medium text-gray-900 mb-4">Customer Details</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="guestCount" className="block text-sm font-medium text-gray-700 mb-1">
                  Guest Count
                </label>
                <input
                  type="number"
                  id="guestCount"
                  name="guestCount"
                  min="1"
                  value={formData.guestCount}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="foodAllergies" className="block text-sm font-medium text-gray-700 mb-1">
                  Food Allergies or Dietary Notes (Optional)
                </label>
                <textarea
                  id="foodAllergies"
                  name="foodAllergies"
                  rows="3"
                  value={formData.foodAllergies}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>
              
              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full bg-red-800 text-white py-2 px-4 rounded font-medium hover:bg-red-700"
                >
                  Complete Booking
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Success Message */}
        {showSuccess && (
          <div className="bg-white p-6 text-center border-t-2 border-red-800">
            <div className="mb-4 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mx-auto">
              <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Your Reservation is Confirmed!</h3>
            <p className="text-sm text-gray-500 mb-6">
              We've sent a confirmation email to your email address.
              We look forward to serving you on {formatDateForDisplay(formData.date)} at {formData.time}.
            </p>
            <button
              type="button"
              onClick={() => {
                setShowSuccess(false);
                setFormData({
                  date: '',
                  time: '',
                  firstName: '',
                  lastName: '',
                  phoneNumber: '',
                  email: '',
                  guestCount: 1,
                  address: '',
                  foodAllergies: '',
                });
              }}
              className="bg-red-800 text-white py-2 px-4 rounded font-medium hover:bg-red-700"
            >
              Make Another Reservation
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default RestaurantBookingForm;