import React, { useState } from "react";
import { Link } from "react-router-dom";
import LoginSample from "./LoginSample";
import { signUp, confirmSignUp } from "aws-amplify/auth";
import { useForm } from "react-hook-form";
import { signIn, signOut, fetchAuthSession } from "aws-amplify/auth";
import { toast } from "react-toastify";

export default function OperatorRegister() {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [activeCategory, setActiveCategory] = useState("operator");
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

      // Save extra info locally or to your backend
      localStorage.setItem("tempRole", "operator");
      localStorage.setItem("tempUserData", JSON.stringify(data));

      setEmail(data.email);
      setStep("confirm");
      toast.success("Verification code sent to your email!");
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Signup failed. Please check console for details.");
    } finally {
      setLoading(false);
    }
  };

  // Handle verification
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
        toast.error("No role found. Please contact support.");
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
      toast.error("Verification failed or login error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {step === "signup" ? (
        <section className="flex">
          <LoginSample />
          <div className="w-[41%] p-12">
            {/* Category Buttons */}
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
                className={`w-44 border rounded-lg p-4 text-center transition-all hover:shadow-[0_4px_25px_gray] shadow-sm ${
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

            {/* Info */}
            <p className="text-gray-600 text-sm mb-8">
              To register as an operator, please fill out the form below and a
              ParkEasy representative will contact you.
            </p>

            {/* FORM */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="bg-white rounded-2xl"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Fields */}
                <InputField
                  label="First Name *"
                  name="firstName"
                  register={register}
                  errors={errors}
                />
                <InputField
                  label="Last Name *"
                  name="lastName"
                  register={register}
                  errors={errors}
                />
                <InputField
                  label="Email *"
                  name="email"
                  type="email"
                  register={register}
                  errors={errors}
                />
                <InputField
                  label="Company *"
                  name="company"
                  register={register}
                  errors={errors}
                />
                <InputField
                  label="Password *"
                  name="password"
                  type="password"
                  register={register}
                  errors={errors}
                />
                <InputField
                  label="Confirm Password *"
                  name="confirmPassword"
                  type="password"
                  register={register}
                  errors={errors}
                />
                <InputField
                  label="Phone Number *"
                  name="phoneNumber"
                  register={register}
                  errors={errors}
                />
                <InputField
                  label="Head Quarter Name *"
                  name="hqname"
                  register={register}
                  errors={errors}
                />
                <InputField
                  label="Head Quarter Contact *"
                  name="hqcontact"
                  register={register}
                  errors={errors}
                />
              </div>

              {/* Terms */}
              <div className="flex items-center mt-6">
                <input
                  id="terms"
                  type="checkbox"
                  {...register("terms", { required: true })}
                  className="h-4 w-4 text-[#469bd5] border-gray-300 rounded focus:ring-[#469bd5]"
                />
                <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                  I agree to{" "}
                  <a href="/" className="text-[#469bd5] underline">
                    privacy policy & terms
                  </a>
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="mt-6 w-full bg-[#469bd5] hover:bg-[#3b88c0] text-white py-2.5 rounded-md font-medium transition-all"
              >
                {loading ? "Registering..." : "Sign Up"}
              </button>

              <p className="text-center text-sm mt-4">
                Already have an account?{" "}
                <Link to="/login" className="text-[#469bd5] font-semibold">
                  Sign in instead
                </Link>
              </p>
            </form>
          </div>
        </section>
      ) : (
        <div className="max-w-md mx-auto mt-10">
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

const InputField = ({ label, name, type = "text", register, errors }) => (
  <div>
    <label className="block text-xs font-bold text-gray-600 mb-1">
      {label}
    </label>
    <input
      {...register(name, { required: true })}
      type={type}
      className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#469bd5]
        ${errors[name] ? "border-red-500 bg-red-50" : "border-gray-300"}`}
    />
  </div>
);
