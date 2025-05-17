import React from "react";
import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { Calendar, Users, Settings, LogOut } from "lucide-react";

function Sidebar({ onLogout }) {
  const location = useLocation();

  const navItems = [
    {
      path: "/dashboard",
      name: "Dashboard",
      icon: <Settings className="w-5 h-5" />,
    },
    {
      path: "/booking-settings",
      name: "Booking Settings",
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      path: "/customer-list",
      name: "Customer List",
      icon: <Users className="w-5 h-5" />,
    },
  ];

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold text-gray-800">Booking Manager</h2>
      </div>
      <nav className="mt-4">
        <ul>
          {navItems.map((item) => (
            <li key={item.path} className="mb-1">
              <Link
                to={item.path}
                className={`flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg mx-2 ${
                  location.pathname === item.path
                    ? "bg-blue-50 text-blue-700"
                    : ""
                }`}
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </Link>
            </li>
          ))}
          <li className="mb-1 mt-8">
            <button
              type="button"
              onClick={onLogout}
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-700 rounded-lg mx-2 w-full text-left"
            >
              <LogOut className="w-5 h-5" />
              <span className="ml-3">Logout</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

Sidebar.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

export default Sidebar;
