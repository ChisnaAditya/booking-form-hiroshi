import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

function MultiStepBookingForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    guestCount: 1,
    address: "",
    foodAllergies: "",
  });

  // Available time slots with remaining spots
  const timeSlots = [
    { time: "5:00 PM", spotsLeft: 1 },
    { time: "7:30 PM", spotsLeft: 1 },
    { time: "9:30 PM", spotsLeft: 2 },
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
          isCurrentMonth: false,
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
        isCurrentMonth: true,
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
          isCurrentMonth: false,
        });
      }
    }

    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  };

  // Format calendar day as ISO date string
  const formatDateToISOString = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
  };

  // Format date for display
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get month name and year for calendar header
  const getMonthYearString = () => {
    return currentMonth.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
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
        date: "",
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
        [name]: "",
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
        time: "",
      });
    }
  };

  // Validate form fields for current step
  const validateStep = () => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!formData.date) newErrors.date = "Please select a date";
      if (!formData.time) newErrors.time = "Please select a time";
    } else if (currentStep === 2) {
      if (!formData.firstName.trim())
        newErrors.firstName = "First name is required";
      if (!formData.lastName.trim())
        newErrors.lastName = "Last name is required";
      if (!formData.phoneNumber.trim())
        newErrors.phoneNumber = "Phone number is required";
      if (!formData.email.trim()) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email))
        newErrors.email = "Email address is invalid";
      if (!formData.address.trim()) newErrors.address = "Address is required";
      if (formData.guestCount < 1)
        newErrors.guestCount = "Guest count must be at least 1";
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
      console.log("Form submitted with data:", formData);

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

    const calDate = new Date(
      calendarDay.year,
      calendarDay.month,
      calendarDay.day
    );
    return calDate < today;
  };

  // Day of week headers
  const weekdays = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="max-w-lg w-full bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-blue-600 px-4 py-5 sm:px-6">
          <h2 className="text-xl leading-6 font-bold text-white">
            Booking Form
          </h2>
          {!showSuccess && (
            <div className="mt-2 flex justify-between">
              <div className="flex items-center">
                <div
                  className={`flex items-center justify-center h-8 w-8 rounded-full ${
                    currentStep === 1
                      ? "bg-white text-blue-600"
                      : "bg-blue-300 text-white"
                  } font-bold`}
                >
                  1
                </div>
                <div className="ml-3 text-sm text-white">Date & Time</div>
              </div>
              <div className="w-12 border-t border-blue-300"></div>
              <div className="flex items-center">
                <div
                  className={`flex items-center justify-center h-8 w-8 rounded-full ${
                    currentStep === 2
                      ? "bg-white text-blue-600"
                      : "bg-blue-300 text-white"
                  } font-bold`}
                >
                  2
                </div>
                <div className="ml-3 text-sm text-white">Customer Details</div>
              </div>
            </div>
          )}
        </div>

        <div className="px-4 py-6 sm:p-6">
          {showSuccess ? (
            <div className="text-center py-8">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg
                  className="h-6 w-6 text-green-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="mt-3 text-lg leading-6 font-medium text-gray-900">
                Booking Successful!
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Your booking has been successfully submitted. We'll contact you
                shortly with confirmation details.
              </p>
              <div className="mt-5">
                <button
                  type="button"
                  onClick={() => {
                    setShowSuccess(false);
                    setCurrentStep(1);
                    setFormData({
                      date: "",
                      time: "",
                      firstName: "",
                      lastName: "",
                      phoneNumber: "",
                      email: "",
                      guestCount: 1,
                      address: "",
                      foodAllergies: "",
                    });
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition ease-in-out duration-150"
                >
                  Make Another Booking
                </button>
              </div>
            </div>
          ) : (
            <div>
              {currentStep === 1 && (
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Select Date and Time
                  </h3>

                  <div className="mb-6">
                    {/* Calendar header */}
                    <div className="flex items-center justify-evenly mb-4">
                      <button
                        onClick={goToPreviousMonth}
                        type="button"
                        className="p-1 rounded-full hover:bg-gray-100"
                      >
                        <ChevronLeft className="h-5 w-5 text-gray-500" />
                      </button>
                      <h4 className="text-lg font-medium text-gray-900">
                        {getMonthYearString()}
                      </h4>
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
                        <div
                          key={day}
                          className="text-center text-sm font-medium text-gray-500"
                        >
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
                              h-10 w-full rounded-full flex items-center justify-center text-sm
                              ${!day.isCurrentMonth ? "text-gray-300" : ""}
                              ${
                                isPast && day.isCurrentMonth
                                  ? "text-gray-400 cursor-not-allowed"
                                  : ""
                              }
                              ${
                                isSelected
                                  ? "bg-red-600 text-white font-medium"
                                  : ""
                              }
                              ${
                                isCurrentDay && !isSelected
                                  ? "border border-red-600 text-red-600"
                                  : ""
                              }
                              ${
                                !isPast &&
                                day.isCurrentMonth &&
                                !isSelected &&
                                !isCurrentDay
                                  ? "hover:bg-gray-100"
                                  : ""
                              }
                            `}
                          >
                            {day.day}
                          </button>
                        );
                      })}
                    </div>

                    {errors.date && (
                      <p className="mt-2 text-sm text-red-600">{errors.date}</p>
                    )}
                  </div>

                  {/* Selected date display */}
                  {formData.date && (
                    <div className="mb-6">
                      <h4 className="text-base font-medium text-gray-900 mb-2">
                        {formatDateForDisplay(formData.date)}
                      </h4>
                      <p className="text-sm text-gray-500">
                        TIME ZONE: EASTERN TIME (GMT-04:00)
                      </p>
                    </div>
                  )}

                  {/* Time slot selection */}
                  {formData.date && (
                    <div className="mb-6">
                      <h4 className="text-base font-medium text-gray-900 mb-2">
                        Available Times
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {timeSlots.map((slot) => (
                          <button
                            key={slot.time}
                            type="button"
                            onClick={() => handleTimeSelect(slot.time)}
                            className={`
                              border rounded-md py-4 px-2 text-center
                              ${
                                formData.time === slot.time
                                  ? "border-blue-600 ring-2 ring-blue-600"
                                  : "border-gray-300 hover:border-gray-400"
                              }
                            `}
                          >
                            <div className="font-medium text-gray-900">
                              {slot.time}
                            </div>
                            <div className="text-sm text-gray-500">
                              {slot.spotsLeft === 1
                                ? "1 spot left"
                                : `${slot.spotsLeft} spots left`}
                            </div>
                          </button>
                        ))}
                      </div>
                      {errors.time && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.time}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex justify-end mt-6">
                    <button
                      type="button"
                      onClick={handleNext}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <form onSubmit={handleSubmit}>
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Customer Details
                  </h3>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="firstName"
                          className="block text-sm font-medium text-gray-700"
                        >
                          First Name
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className={`mt-1 block w-full border ${
                            errors.firstName
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                        />
                        {errors.firstName && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.firstName}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="lastName"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Last Name
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className={`mt-1 block w-full border ${
                            errors.lastName
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                        />
                        {errors.lastName && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.lastName}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="phoneNumber"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phoneNumber"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          className={`mt-1 block w-full border ${
                            errors.phoneNumber
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                        />
                        {errors.phoneNumber && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.phoneNumber}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`mt-1 block w-full border ${
                            errors.email ? "border-red-500" : "border-gray-300"
                          } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                        />
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="guestCount"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Guest Count
                      </label>
                      <input
                        type="number"
                        id="guestCount"
                        name="guestCount"
                        min="1"
                        value={formData.guestCount}
                        onChange={handleChange}
                        className={`mt-1 block w-full border ${
                          errors.guestCount
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                      />
                      {errors.guestCount && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.guestCount}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="address"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Address
                      </label>
                      <textarea
                        id="address"
                        name="address"
                        rows="3"
                        value={formData.address}
                        onChange={handleChange}
                        className={`mt-1 block w-full border ${
                          errors.address ? "border-red-500" : "border-gray-300"
                        } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                      />
                      {errors.address && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.address}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="foodAllergies"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Food Allergies or Dietary Notes (Optional)
                      </label>
                      <textarea
                        id="foodAllergies"
                        name="foodAllergies"
                        rows="3"
                        value={formData.foodAllergies}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between mt-8">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MultiStepBookingForm;
