import React, { useState } from "react";

import {
  useNavigate
} from "react-router-dom";

import "../styles/auth.css";

function ManagerLogin() {

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const navigate = useNavigate();

  const handleManagerLogin = (e) => {

    e.preventDefault();

    setError("");

    if (
      email === "admin@hotel.com" &&
      password === "admin123"
    ) {

      localStorage.setItem(
        "manager",
        "true"
      );

      navigate(
        "/manager-dashboard"
      );

    } else {

      setError(
        "Invalid manager credentials"
      );

    }

  };

  return (

    <div className="auth-container">

      <div className="auth-box auth-box-small">

        <div className="auth-avatar">
          <span>👨‍💼</span>
        </div>

        <h1>
          Manager Login
        </h1>

        <p className="login-as-text">
          Admin Access
        </p>

        {error && (

          <div className="error-message">
            {error}
          </div>

        )}

        <form
          onSubmit={
            handleManagerLogin
          }
          className="auth-form"
        >

          <div className="form-input-row">

            <span className="input-icon">
              📧
            </span>

            <input
              type="email"
              placeholder="Manager Email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
            />

          </div>

          <div className="form-input-row">

            <span className="input-icon">
              🔒
            </span>

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
            />

          </div>

          <button
            type="submit"
            className="auth-button"
          >
            Login
          </button>

        </form>

      </div>

    </div>

  );

}

export default ManagerLogin;