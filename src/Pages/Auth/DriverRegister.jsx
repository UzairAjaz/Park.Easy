import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  signUp,
  confirmSignUp,
  resendSignUpCode,
  signIn,
  signOut,
  fetchAuthSession,
} from "aws-amplify/auth";
import { toast } from "react-toastify";
import LoginSample from "./LoginSample";

export default function DriverRegister() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [step, setStep] = useState("signup");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [activeCategory, setActiveCategory] = useState("driver");

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      setEmail(data.email);

      await signUp({
        username: data.email,
        password: data.password,
        options: {
          userAttributes: {
            email: data.email,
            phone_number: data.phone,
          },
        },
      });

      // store temp info
      localStorage.setItem("tempUserEmail", data.email);
      localStorage.setItem("tempUserPassword", data.password);
      localStorage.setItem("tempRole", "driver");

      toast.success("Verification code sent to your email!");
      setStep("confirm");
    } catch (err) {
      // If user already exists but is not confirmed → resend code
      if (err.name === "UsernameExistsException") {
        try {
          await resendSignUpCode({ username: data.email });
          toast.info("Account already exists. New verification code sent!");
          setStep("confirm");
        } catch{
          toast.error("Failed to resend verification code.");
        }
      } else {
        console.error("Signup error:", err);
        toast.error(err.message || "Signup failed. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    setLoading(true);

    const emailToUse =
      email || localStorage.getItem("tempUserEmail") || watch("email");
    const passwordToUse =
      watch("password") || localStorage.getItem("tempUserPassword");

    if (!emailToUse) {
      toast.error("Email not found. Please sign up again.");
      setStep("signup");
      setLoading(false);
      return;
    }

    try {
      // Confirm latest code
      await confirmSignUp({
        username: emailToUse,
        confirmationCode: verificationCode.trim(),
      });

      toast.success("Verification successful!");
      await signOut({ global: true });

      // Auto sign in
      await signIn({ username: emailToUse, password: passwordToUse });
      const session = await fetchAuthSession();
      const role =
        session.tokens?.idToken?.payload?.["custom:role"] ||
        localStorage.getItem("tempRole");

      localStorage.setItem("role", role);
      toast.success("Login successful!");

      // Redirect based on role
      if (role === "driver") {
        window.location.href = "/driver/dashboard";
      } else if (role === "operator") {
        window.location.href = "/operator/dashboard";
      } else {
        window.location.href = "/";
      }
    } catch (err) {
      console.error("Confirmation/Login error:", err);
      toast.error(err.message || "Verification failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      toast.error("Please sign up first to get a verification code.");
      return;
    }

    try {
      await resendSignUpCode({ username: email });
      toast.info("New verification code sent to your email!");
    } catch (err) {
      console.error("Resend code error:", err);
      toast.error("Failed to resend verification code.");
    }
  };

  return (
    <>
      {step === "signup" ? (
        <section className="flex">
          <LoginSample />

          <div className="p-12 flex flex-col justify-center w-[41%]">
            {/* Role Selection */}
            <div className="flex justify-center flex-wrap gap-4 mb-6 mt-10">
              <Link
                to="/register-driver"
                onClick={() => setActiveCategory("driver")}
                className={`w-44 border rounded-lg p-6 text-center transition-all hover:shadow-[0_4px_25px_gray] shadow-sm ${
                  activeCategory === "driver"
                    ? "border-[#469bd5] bg-[#469bd5]"
                    : "border-blue-300"
                }`}
              >
                <div className="flex flex-col gap-4">
                  <i
                    className={`fa-solid fa-person text-5xl ${
                      activeCategory === "driver"
                        ? "text-white"
                        : "text-[#469bd5]"
                    }`}
                  ></i>
                  <p
                    className={`font-medium text-sm ${
                      activeCategory === "driver"
                        ? "text-white"
                        : "text-[#469bd5]"
                    }`}
                  >
                    Driver
                  </p>
                </div>
              </Link>

              <Link
                to="/register-operator"
                onClick={() => setActiveCategory("operator")}
                className={`w-44 border rounded-lg p-6 text-center transition-all hover:shadow-[0_4px_25px_gray] shadow-sm ${
                  activeCategory === "operator"
                    ? "border-[#469bd5] bg-[#469bd5]"
                    : "border-gray-300"
                }`}
              >
                <div className="flex flex-col gap-4">
                  <i
                    className={`fa-solid fa-building text-5xl ${
                      activeCategory === "operator"
                        ? "text-white"
                        : "text-[#469bd5]"
                    }`}
                  ></i>
                  <p
                    className={`font-medium text-sm ${
                      activeCategory === "operator"
                        ? "text-white"
                        : "text-[#469bd5]"
                    }`}
                  >
                    Parking Facility Operator
                  </p>
                </div>
              </Link>
            </div>

            {/* Signup Form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-8 bg-white rounded-2xl"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-1">
                    First Name *
                  </label>
                  <input
                    {...register("firstName", { required: true })}
                    className={`w-full border rounded-md px-4 py-2 ${
                      errors.firstName
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-1">
                    Last Name *
                  </label>
                  <input
                    {...register("lastName", { required: true })}
                    className={`w-full border rounded-md px-4 py-2 ${
                      errors.lastName
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-1">
                    Email *
                  </label>
                  <input
                    {...register("email", {
                      required: true,
                      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    })}
                    type="email"
                    className={`w-full border rounded-md px-4 py-2 ${
                      errors.email
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-1">
                    Phone Number *
                  </label>
                  <input
                    {...register("phone", {
                      required: true,
                      pattern: /^\+?\d{7,15}$/,
                    })}
                    type="tel"
                    placeholder="+1 (702) 123-4567"
                    className={`w-full border rounded-md px-4 py-2 ${
                      errors.phone
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-1">
                    Password *
                  </label>
                  <input
                    {...register("password", { required: true, minLength: 8 })}
                    type="password"
                    placeholder="············"
                    className={`w-full border rounded-md px-4 py-2 ${
                      errors.password
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-1">
                    Confirm Password *
                  </label>
                  <input
                    {...register("confirmPassword", {
                      required: true,
                      validate: (value) => value === watch("password"),
                    })}
                    type="password"
                    placeholder="············"
                    className={`w-full border rounded-md px-4 py-2 ${
                      errors.confirmPassword
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-center mt-6">
                <input
                  id="terms"
                  name="agree"
                  type="checkbox"
                  className="h-4 w-4 text-[#469bd5] border-gray-300 rounded focus:ring-[#469bd5]"
                />
                <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                  I agree to the{" "}
                  <a href="/" className="text-[#469bd5] underline">
                    privacy policy & terms
                  </a>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full bg-[#469bd5] hover:bg-[#3b88c0] text-white py-2.5 rounded-md font-medium transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? "Signing up..." : "Sign Up"}
              </button>
            </form>
          </div>
        </section>
      ) : (
        // CONFIRMATION PAGE
        <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-xl shadow">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Verify Your Email
          </h2>
          <p className="text-gray-600 mb-6">
            We've sent a verification code to <strong>{email}</strong>
          </p>

          <form onSubmit={handleConfirm}>
            <input
              name="verificationCode"
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter 6-digit code"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#469bd5]"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full bg-[#469bd5] hover:bg-[#3b88c0] text-white py-2.5 rounded-md font-medium transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying..." : "Verify Email"}
            </button>

            <button
              type="button"
              onClick={handleResendCode}
              className="w-full mt-3 text-[#469bd5] hover:underline text-sm"
            >
              Resend Code
            </button>

            <button
              type="button"
              onClick={() => setStep("signup")}
              className="w-full mt-2 text-gray-500 hover:underline text-sm"
            >
              Back to Sign Up
            </button>
          </form>
        </div>
      )}
    </>
  );
}
