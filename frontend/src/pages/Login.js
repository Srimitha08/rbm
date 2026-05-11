import React, { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";

function Login() {
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
        setError("Please fill in all fields");
        setLoading(false);
        return;
      }

      const res = await API.post("/api/auth/login", {
        email,
        password
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem(
        "userName",
        res.data.name || email.split("@")[0]
      );

      localStorage.setItem(
        "userRole",
        res.data.role || "USER"
      );

      navigate("/customer-dashboard");

    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box auth-box-small">

        <div className="auth-avatar">
          <span>👤</span>
        </div>

        <h1>Customer Login</h1>

        <p className="login-as-text">
          Guest Login
        </p>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

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

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Sign In"}
          </button>

        </form>

        <div className="auth-footer">

          <p>
            Don't have an account?{" "}
            <Link to="/register" className="auth-link">
              Register now
            </Link>
          </p>

          <p style={{ marginTop: "15px", fontSize: "13px" }}>
            Are you a manager?{" "}
            <Link to="/manager-login" className="auth-link">
              Login here
            </Link>
          </p>

        </div>

      </div>
    </div>
  );
}

export default Login;