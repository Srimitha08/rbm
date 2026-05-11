import React, { useState } from "react";
import API from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import "../styles/auth.css";

function ManagerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!email || !password) {
        setError("Please enter email and password");
        setLoading(false);
        return;
      }

      const res = await API.post("/auth/login", {
        email,
        password
      });

      if (res.data.role !== "ADMIN") {
        setError(`Login failed: Your account role is '${res.data.role}', not ADMIN. Use admin@hotel.com / admin123.`);
        setLoading(false);
        return;
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userName", res.data.name || email.split("@")[0]);
      localStorage.setItem("userRole", res.data.role);
      alert("Manager login successful!");
      navigate("/admin-dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box auth-box-small">
        <div className="auth-avatar">
          <span>👨‍💼</span>
        </div>
        <h1>Manager Login</h1>
        <p className="login-as-text">
          Admin Access Only
        </p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-input-row">
            <span className="input-icon">📧</span>
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="form-input-row">
            <span className="input-icon">🔒</span>
            <input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Are you a guest? <Link to="/login" className="auth-link">Customer login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ManagerLogin;
