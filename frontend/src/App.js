import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import BookingPage from "./pages/BookingPage";
import ManagerDashboard from "./pages/ManagerDashboard";

function App() {
  return (
    <Router>

      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/customer-dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/book-room/:id"
          element={<BookingPage />}

        />
        <Route
  path="/manager-dashboard"
  element={<ManagerDashboard />}
/>

      </Routes>

    </Router>
  );
}

export default App;