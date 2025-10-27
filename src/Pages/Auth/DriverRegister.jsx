import React from "react";
import { useState } from "react";
import LoginSample from "./LoginSample";
import { Link } from "react-router-dom";
import { signUp, confirmSignUp } from "aws-amplify/auth";
import { useForm } from "react-hook-form";
import { signIn, signOut, fetchAuthSession } from "aws-amplify/auth";

export default function DriverRegister() {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [activeCategory, setActiveCategory] = useState("driver");
  const [step, setStep] = useState("signup");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await signUp({
        username: data.email,
        password: data.password,
        options: {
          userAttributes: {
            email: data.email,
          },
        },
      });

      // Save other data locally or to your backend
      localStorage.setItem("tempRole", "driver");
      localStorage.setItem("tempUserData", JSON.stringify(data));

      setEmail(data.email);
      setStep("confirm");
      alert("Verification code sent to your email!");
    } catch (err) {
      console.error("Signup error:", err);
      alert("Signup failed. Try again with different credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Step 1: Confirm email
      await confirmSignUp({
        username: email,
        confirmationCode: verificationCode,
      });

      // Step 2: Sign out temporary session
      await signOut({ global: true });

      // Step 3: Sign in automatically
      await signIn({
        username: email,
        password: watch("password"), // password from form
      });

      // Step 4: Fetch role (use fallback if missing)
      const session = await fetchAuthSession();
      const roleFromToken = session.tokens?.idToken?.payload?.["custom:role"];
      const role = roleFromToken || localStorage.getItem("tempRole");

      if (!role) {
        alert("No role found. Please contact support.");
        return;
      }

      // Step 5: Store role and redirect
      localStorage.setItem("role", role);

      if (role === "driver") {
        window.location.href = "/driver/dashboard";
      } else if (role === "operator") {
        window.location.href = "/operator/dashboard";
      } else {
        window.location.href = "/";
      }
    } catch (err) {
      console.error("Confirmation/Login error:", err);
      alert("Verification failed or login error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {step === "signup" ? (
        <section className="flex">
          <LoginSample />
          <div className="p-12 flex flex-col justify-center w-[41%]">
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
                {/* <i className="fa-solid fa-person text-4xl text-[#469bd5] mb-2"></i>
                 <p className="font-medium text-[#469bd5]">Driver</p> */}
                <div className="flex flex-col gap-4">
                  <i
                    className={`fa-solid fa-person text-5xl text-[#469bd5] ${
                      activeCategory === "driver"
                        ? "text-white"
                        : "border-gray-300"
                    }`}
                  ></i>
                  <p
                    className={`font-medium text-[#469bd5] text-sm ${
                      activeCategory === "driver" ? "text-white" : ""
                    }`}
                  >
                    Driver
                  </p>
                </div>
              </Link>

              <Link
                to="/register-operator"
                onClick={() => setActiveCategory("operator")}
                className={`w-44 border rounded-lg p-4 text-center transition-all hover:shadow-[0_4px_25px_gray] shadow-sm  ${
                  activeCategory === "operator"
                    ? "border-[#469bd5] bg-[#469bd5]"
                    : "border-gray-300"
                }`}
              >
                <div className="flex flex-col gap-4">
                  <i
                    className={`fa-solid fa-building text-5xl text-[#469bd5] ${
                      activeCategory === "operator"
                        ? "text-white"
                        : "border-gray-300"
                    }`}
                  ></i>
                  <p
                    className={`font-medium text-[#469bd5] text-sm ${
                      activeCategory === "operator" ? "text-white" : ""
                    }`}
                  >
                    Parking Facility Operator
                  </p>
                </div>
              </Link>
            </div>
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
                    className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#469bd5] 
        ${errors.firstName ? "border-red-500 bg-red-50" : "border-gray-300"}`}
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-1">
                    Last Name *
                  </label>
                  <input
                    {...register("lastName", { required: true })}
                    className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#469bd5] 
        ${errors.lastName ? "border-red-500 bg-red-50" : "border-gray-300"}`}
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
                    className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#469bd5] 
        ${errors.email ? "border-red-500 bg-red-50" : "border-gray-300"}`}
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
                    className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#469bd5] 
        ${errors.phone ? "border-red-500 bg-red-50" : "border-gray-300"}`}
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-1">
                    Password *
                  </label>
                  <input
                    {...register("password", {
                      required: true,
                      minLength: 8,
                    })}
                    type="password"
                    placeholder="············"
                    className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#469bd5] 
        ${errors.password ? "border-red-500 bg-red-50" : "border-gray-300"}`}
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
                    className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#469bd5] 
        ${
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
                  // checked={formData.agree}
                  // onChange={handleChange}
                  className="h-4 w-4 text-[#469bd5] border-gray-300 rounded focus:ring-[#469bd5]"
                />
                <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                  I agree to the{" "}
                  <a href="/" className="text-[#469bd5] underline">
                    privacy policy & terms
                  </a>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="mt-6 w-full bg-[#469bd5] hover:bg-[#3b88c0] text-white py-2.5 rounded-md font-medium transition-all"
              >
                Sign Up
              </button>
            </form>
          </div>
        </section>
      ) : (
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Verify Your Email
          </h2>
          <p className="text-gray-600 mb-6">
            We've sent a verification code to <strong>{email}</strong>
          </p>

          <form onSubmit={handleConfirm}>
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-600 mb-1">
                Verification Code *
              </label>
              <input
                name="verificationCode"
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter 6-digit code"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#469bd5]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#469bd5] hover:bg-[#3b88c0] text-white py-2.5 rounded-md font-medium transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying..." : "Verify Email"}
            </button>

            <button
              type="button"
              onClick={() => setStep("signup")}
              className="w-full mt-3 text-[#469bd5] hover:underline text-sm"
            >
              Back to Sign Up
            </button>
          </form>
        </div>
      )}
    </>
  );
}
