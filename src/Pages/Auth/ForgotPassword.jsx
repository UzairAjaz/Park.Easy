import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { resetPassword, confirmResetPassword } from "aws-amplify/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ForgotPassword() {
  const [step, setStep] = useState("request");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Step 1: Request password reset code
  const handleRequest = async (data) => {
    setLoading(true);
    try {
      await resetPassword({ username: data.email });
      alert("Verification code sent to your email!");
      setEmail(data.email);
      setStep("confirm");
    } catch (err) {
      console.error("Reset error:", err);
      alert("Error sending code. Please check your email and try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Confirm and set new password
  const handleConfirm = async (data) => {
    setLoading(true);
    try {
      await confirmResetPassword({
        username: email,
        confirmationCode: data.code,
        newPassword: data.newPassword,
      });

      alert("Password reset successful! You can now log in.");
      window.location.href = "/login";
    } catch (err) {
      console.error("Confirm error:", err);
      alert("Invalid code or password error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        {step === "request" ? (
          <>
            <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700">
              Forgot Password
            </h2>
            <form onSubmit={handleSubmit(handleRequest)}>
              <div>
                <Input
                  type="email"
                  placeholder="Enter your registered email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email format",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full mt-4 bg-[#469bd5] text-white"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Code"}
              </Button>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700">
              Reset Password
            </h2>
            <form onSubmit={handleSubmit(handleConfirm)}>
              <div>
                <Input
                  placeholder="Verification Code"
                  {...register("code", { required: "Code is required" })}
                />
                {errors.code && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.code.message}
                  </p>
                )}
              </div>

              <div className="mt-2">
                <Input
                  type="password"
                  placeholder="New Password"
                  {...register("newPassword", {
                    required: "New password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters long",
                    },
                  })}
                />
                {errors.newPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full mt-4 bg-[#469bd5] text-white"
                disabled={loading}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
