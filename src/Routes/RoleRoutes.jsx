import ProtectedRoute from "../lib/ProtectedRoute";
import DriverDashboard from "../Pages/Dashboard/DriverDashboard";
import OperatorDashboard from "../Pages/Dashboard/OperatorDashboard";
import ForgotPassword from "../Pages/Auth/ForgotPassword";

const roleRoutes = [
  {
    path: "driver/dashboard",
    element: (
      <ProtectedRoute allowedRoles={["driver"]}>
        <DriverDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "operator/dashboard",
    element: (
      <ProtectedRoute allowedRoles={["operator"]}>
        <OperatorDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "forgot-password",
    element: <ForgotPassword />
  },
];

export default roleRoutes;
