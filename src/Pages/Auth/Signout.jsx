// src/components/LogoutButton.jsx
import { signOut } from "aws-amplify/auth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      localStorage.removeItem("role");
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <Button
      onClick={handleLogout}
      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
    >
      Logout
    </Button>
  );
}
