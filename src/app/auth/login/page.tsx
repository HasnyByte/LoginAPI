"use client";

import { useState } from "react";
import { toast, Bounce, ToastContainer } from "react-toastify";
import { FcGoogle } from "react-icons/fc";
import API from "@/app/utils/API";
import Auth from "@/app/utils/Auth"; 
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onLogin = () => {
    setIsLoading(true);
    API.post("/users/login", {
      email,
      password,
    })
      .then((res) => {
        setIsLoading(false);
        const data = {
          user: {
            id: res.data.data._id,
            fullName: res.data.data.fullName,
            phone: res.data.data.phone,
            email: res.data.data.email,
          },
          token: `Bearer ${res.data.data.token}`,
        };
        Auth.login(data);
        toast.success(`${res.data.message}`, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
          transition: Bounce,
        });
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error(`${err.response.data.message}`, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
          transition: Bounce,
        });
        console.log("error", err);
      });
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-green-900">
        <div className="bg-[#0F0F0F] p-10 rounded-2xl shadow-2xl max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Section - Form */}
          <div className="text-white flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-1">Login to Your Account</h2>
  
            <button
              className="flex items-center justify-center gap-2 w-full bg-white text-black py-2 px-4 rounded-lg mb-4 hover:bg-gray-200 transition"
            >
              <FcGoogle size={20} /> Login with Google
            </button>
  
            <div className="flex items-center mb-4">
              <div className="flex-grow border-t border-gray-600" />
              <span className="px-3 text-gray-500 text-sm">OR</span>
              <div className="flex-grow border-t border-gray-600" />
            </div>
  
            <input
              type="email"
              placeholder="Email"
              className="bg-gray-800 text-white w-full py-2 px-4 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
  
            <input
              type="password"
              placeholder="Password"
              className="bg-gray-800 text-white w-full py-2 px-4 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
  
            <div className="flex justify-between items-center text-sm text-gray-400 mb-6">
              <label>
                <input type="checkbox" className="mr-2" /> Remember Me
              </label>
              <a href="#" className="hover:underline">
                Forgot Password?
              </a>
            </div>
  
            <button
              onClick={onLogin}
              className="bg-green-500 hover:bg-green-600 text-white w-full py-2 rounded-lg font-semibold transition"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login to Your Account"}
            </button>
  
            <p className="text-sm text-gray-500 mt-4">
              Not a member yet?{" "}
              <a href="#" className="text-green-400 hover:underline">
                Register Now
              </a>
            </p>
          </div>
  
          {/* Right Section - Visuals */}
          <div className="hidden md:flex items-center justify-center">
            <img
              src="/login-visual.png"
              alt="Login Visual"
              className="w-[90%] object-contain rounded-xl"
            />
          </div>
        </div>
      </div>  
      <ToastContainer />
    </>
  );
}
