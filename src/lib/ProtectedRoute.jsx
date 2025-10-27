import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const [userRole, setUserRole] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    setUserRole(role);
    setChecked(true);
  }, []);

  if (!checked) return null; 

  if (!userRole) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(userRole)) {
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
