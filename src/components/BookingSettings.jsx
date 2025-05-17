import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Sidebar from "./Sidebar";

function BookingSettings({ onLogout }) {
  const [availableTimes, setAvailableTimes] = useState([]);
  const [newTime, setNewTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Mock API functions for demonstration purposes
  const fetchTimes = async () => {
    try {
      setLoading(true);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Dummy data
      const dummyTimes = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];
      setAvailableTimes(dummyTimes);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch booking times");
      setLoading(false);
    }
  };

  const addTime = async (time) => {
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Add time to the local state
      setAvailableTimes([...availableTimes, time]);
      return true;
    } catch (err) {
      setError("Failed to add time");
      return false;
    }
  };

  const deleteTime = async (time) => {
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Remove time from the local state
      setAvailableTimes(availableTimes.filter((t) => t !== time));
      return true;
    } catch (err) {
      setError("Failed to delete time");
      return false;
    }
  };

  useEffect(() => {
    fetchTimes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newTime) {
      setError("Please enter a valid time");
      return;
    }

    const success = await addTime(newTime);
    if (success) {
      setNewTime("");
      setError("");
    }
  };

  const handleDelete = async (time) => {
    await deleteTime(time);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar onLogout={onLogout} />
      <div className="flex-1 p-10">
        <h1 className="text-3xl font-semibold text-gray-800">
          Booking Settings
        </h1>

        <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-medium text-gray-700 mb-4">
            Add Booking Time
          </h2>
          <form onSubmit={handleSubmit} className="flex space-x-4 mb-6">
            <input
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Time
            </button>
          </form>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <h2 className="text-xl font-medium text-gray-700 mb-4 mt-8">
            Available Booking Times
          </h2>
          {loading ? (
            <p className="text-gray-600">Loading booking times...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableTimes.length === 0 ? (
                <p className="text-gray-600">No booking times available.</p>
              ) : (
                availableTimes.map((time) => (
                  <div
                    key={time}
                    className="flex items-center justify-between bg-gray-50 p-4 rounded-md border border-gray-200"
                  >
                    <span className="text-gray-800 font-medium">{time}</span>
                    <button
                      type="button"
                      onClick={() => handleDelete(time)}
                      className="ml-2 text-red-600 hover:text-red-800 focus:outline-none"
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

BookingSettings.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

export default BookingSettings;
