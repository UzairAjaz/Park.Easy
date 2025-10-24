import { React , useState} from "react";
import LoginSample from "./LoginSample";
import { Link } from "react-router-dom";

export default function SignUp() {
  const [activeCategory, setActiveCategory] = useState("");
  return (
    <main className="flex min-h-screen">
      <LoginSample />
      {/* Right section */}
      <div className="flex-1 p-12 flex flex-col justify-center items-center bg-white">
        <h2 className="font-semibold mb-6 text-2xl text-center text-gray-500">
          Select Your Profile Category
        </h2>

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
                  activeCategory === "driver" ? "text-white" : "border-gray-300"
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
                : "border-blue-300"
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

        <Link
          to="/login"
          className="text-[#469bd5] text-center mt-8 text-sm flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="rotate-rtl"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          Back to login
        </Link>
      </div>
    </main>
  );
}
