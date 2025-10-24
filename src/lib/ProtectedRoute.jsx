import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const userRole = localStorage.getItem("role"); 

  // Not logged in
  if (!userRole) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but not allowed to access this route
  if (!allowedRoles.includes(userRole)) {
    // Redirect them to their own dashboard instead of showing error
    switch (userRole) {
      case "driver":
        return <Navigate to="/driver/dashboard" replace />;
      case "operator":
        return <Navigate to="/operator/dashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
