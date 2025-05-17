import React from "react";
import PropTypes from "prop-types";
import Sidebar from "./Sidebar";

function Dashboard({ onLogout }) {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar onLogout={onLogout} />
      <div className="flex-1 p-10">
        <h1 className="text-3xl font-semibold text-gray-800">Dashboard</h1>
        <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-medium text-gray-700 mb-4">
            Welcome to the Booking Management System
          </h2>
          <p className="text-gray-600">
            Use the sidebar navigation to manage booking times and view customer
            data.
          </p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-medium text-blue-800">Booking Settings</h3>
              <p className="text-blue-600 text-sm mt-1">
                Manage available booking times
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-medium text-green-800">Customer List</h3>
              <p className="text-green-600 text-sm mt-1">
                View customer bookings and details
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Dashboard.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

export default Dashboard;
