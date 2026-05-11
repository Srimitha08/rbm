import React from "react";
import { Link } from "react-router-dom";
import "../styles/auth.css";

function LoginSelection() {
  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>Hotel Booking System</h1>
        <h2>Select Your Login Type</h2>

        <div className="login-options">
          <Link to="/login" className="option-card">
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>👤</div>
            <h3>Customer Login</h3>
            <p>Book rooms, view your reservations, and manage your bookings.</p>
          </Link>
          <Link to="/manager-login" className="option-card manager-card">
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>👨‍💼</div>
            <h3>Manager Login</h3>
            <p>Manage rooms, view all bookings, and control availability.</p>
          </Link>
          <Link to="/register" className="option-card">
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>✍️</div>
            <h3>Create Account</h3>
            <p>Don't have an account? Register as a new customer here.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginSelection;
