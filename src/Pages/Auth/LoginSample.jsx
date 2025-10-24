import React from "react";
import logo from "@/assets/logo.png"
export default function LoginSample() {
  return (
    <>
      <div className="w-[58.5%] min-h-screen bg-[url(@/assets/mainbg.jpg)] bg-right-top ">
        <div className="w-[50px] h-[50px] ml-6 absolute z-10 top-8">
          <a href="/">
            <img src={logo} alt="logo" />
          </a>
        </div>
        <div className="p-16 text-center h-screen flex justify-center items-center ">
          <div className="">
            <h1 className="text-5xl text-white font-bold mb-16 leading-tight">
              A TRUE FULLY <br />
              AUTONOMOUS PARKING <br />
              PAYMENT SOLUTION
            </h1>
            <h2 className="text-white text-2xl">
              NO APPS, NO PAYSTATIONS, NO CAMERAS, NO HASSLE
            </h2>
          </div>
        </div>
      </div>
    </>
  );
}
