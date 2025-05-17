import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import FormEmail from "./FormEmail";
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import LoginPage from "./components/LoginPage";
import Dashboard from "./components/Dashboard";
import BookingSettings from "./components/BookingSettings";
import CustomerList from "./components/CustomerList";
import ProtectedRoute from "./components/ProtectedRoute";
import MultiStepBookingForm from "./MultiStepBookingForm";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loginStatus = localStorage.getItem("isLoggedIn");
    if (loginStatus === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    localStorage.setItem("isLoggedIn", "true");
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
  };

  const myRouter = createBrowserRouter([
    {
      path: "/",
      element: <FormEmail />,
    },
  ]);
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <Navigate to="/dashboard" />
              ) : (
                <LoginPage onLogin={handleLogin} />
              )
            }
          />
          <Route path="/booking" element={<FormEmail />} />
          <Route path="/multi" element={<MultiStepBookingForm />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Dashboard onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/booking-settings"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <BookingSettings onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer-list"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <CustomerList onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
