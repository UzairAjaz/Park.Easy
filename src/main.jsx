import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App.jsx";
import Login from "./Pages/Auth/Login";
import SignUp from "./Pages/Auth/SignUp";
import DriverRegister from "./Pages/Auth/DriverRegister";
import OperatorRegister from "./Pages/Auth/OperatorRegister";
import roleRoutes from "./Routes/RoleRoutes";

import "./index.css";
import "./aws-config"; // Import your Amplify config here

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Navigate to="/login" replace /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <SignUp /> },
      { path: "register-driver", element: <DriverRegister /> },
      { path: "register-operator", element: <OperatorRegister /> },
      ...roleRoutes,
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
