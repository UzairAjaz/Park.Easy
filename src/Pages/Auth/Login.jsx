import { React, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import LoginSample from "./LoginSample";
import { signIn, signOut, fetchAuthSession } from "aws-amplify/auth";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onsubmit = async (data) => {
    setLoading(true);
    try {
      await signOut({ global: true }).catch(() => {});

      await signIn({
        username: data.email,
        password: data.password,
      });

      const session = await fetchAuthSession();
      const roleFromToken = session.tokens?.idToken?.payload?.["custom:role"];
      const tempRole = localStorage.getItem("tempRole");
      const role = roleFromToken || tempRole;

      if (!role) {
        alert("No role found. Please contact support.");
        return;
      }

      // Step 3: Save role and redirect
      localStorage.setItem("role", role);

      if (role === "driver") navigate("/driver/dashboard");
      else if (role === "operator") navigate("/operator/dashboard");
      else navigate("/login");
    } catch (err) {
      console.error("Login error:", err);
      if (err.name === "UserNotConfirmedException") {
        alert("Please verify your email before logging in.");
      } else {
        alert("Invalid credentials. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex">
      {/* left section */}
      <LoginSample />

      {/* right section */}
      <div className="flex-1 flex items-center justify-center bg-white px-38 mx-auto">
        <div className="w-full max-w-md space-y-6">
          <h2 className="text-2xl text-gray-700">Welcome to Park.Easy!</h2>
          <p className="text-sm text-gray-600">
            Please sign-in to your account and start the adventure
          </p>

          <form onSubmit={handleSubmit(onsubmit)} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#5e5873] mb-1">
                Email
              </label>
              <Input
                {...register("email", { required: true })}
                className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#469bd5] 
                ${
                  errors.email ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
              />
            </div>

            {/* Password */}
            <div className="flex justify-between items-center">
              <label className="text-sm text-[#5e5873]">Password</label>
              <small
                onClick={() => navigate("/forgot-password")}
                className="text-blue-500 cursor-pointer hover:underline"
              >
                Forgot Password?
              </small>
            </div>

            <div className="relative mb-4">
              <Input
                type="password"
                placeholder="••••••••"
                {...register("password", { required: true })}
                className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#469bd5] 
                ${
                  errors.password
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="bg-[#469bd5] hover:bg-[#3b88c0] text-white w-full disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-sm text-[#5e5873]">
            New on our platform?{" "}
            <Link to="/register" className="text-[#469bd5] font-semibold">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default Login;
