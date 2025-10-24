import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./Pages/Auth/Login";
import SignUp from "./Pages/Auth/SignUp";
import DriverRegister from "./Pages/Auth/DriverRegister";
import OperatorRegister from "./Pages/Auth/OperatorRegister";
import "./index.css";
import App from "./App.jsx";
import "./aws-config";
import roleRoutes from "./Routes/RoleRoutes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <SignUp /> },
      { path: "register-driver", element: <DriverRegister /> },
      { path: "register-operator", element: <OperatorRegister /> },
      ...roleRoutes, // merge driver/operator routes
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
