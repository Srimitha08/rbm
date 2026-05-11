import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginSelection from "./pages/LoginSelection";
import Login from "./pages/Login";
import ManagerLogin from "./pages/ManagerLogin";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginSelection />} />
        <Route path="/login" element={<Login />} />
        <Route path="/manager-login" element={<ManagerLogin />} />
        <Route path="/register" element={<Register />} />
        
        <Route 
          path="/customer-dashboard" 
          element={
            <ProtectedRoute requiredRole="USER">
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin-dashboard" 
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;