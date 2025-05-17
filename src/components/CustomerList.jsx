import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Sidebar from "./Sidebar";

function CustomerList({ onLogout }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const fetchCustomers = async () => {
    try {
      setLoading(true);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Dummy customer data
      const dummyCustomers = [
        {
          id: 1,
          name: "John Doe",
          email: "john.doe@example.com",
          phone: "555-123-4567",
          guestCount: 2,
          foodAllergies: "None",
          selectedTime: "10:00",
        },
        {
          id: 2,
          name: "Jane Smith",
          email: "jane.smith@example.com",
          phone: "555-987-6543",
          guestCount: 4,
          foodAllergies: "Nuts, Dairy",
          selectedTime: "14:00",
        },
      ];
      setCustomers(dummyCustomers);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch customer data");
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar onLogout={onLogout} />
      <div className="flex-1 p-10">
        <h1 className="text-3xl font-semibold text-gray-800">Customer List</h1>

        <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-medium text-gray-700 mb-4">
            Customer Bookings
          </h2>

          {loading ? (
            <p className="text-gray-600">Loading customer data...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Guests
                    </th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Food Allergies
                    </th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Selected Time
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {customers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="py-4 px-6 text-sm font-medium text-gray-900">
                        {customer.name}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-500">
                        {customer.email}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-500">
                        {customer.phone}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-500">
                        {customer.guestCount}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-500">
                        {customer.foodAllergies}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-500">
                        {customer.selectedTime}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

CustomerList.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

export default CustomerList;
