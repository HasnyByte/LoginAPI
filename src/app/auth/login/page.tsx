"use client";

import { useState } from "react";
import { toast, Bounce, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import API from "@/app/utils/API";
import Auth from "@/app/utils/Auth";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const onLogin = () => {
        setIsLoading(true);
        API.post("/auth/login", {
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
                    theme: "light",
                    transition: Bounce,
                });
                router.push("/todos");
            })
            .catch((err) => {
                setIsLoading(false);
                toast.error(`${err.response?.data?.message || "Login failed"}`, {
                    position: "top-center",
                    autoClose: 5000,
                    theme: "light",
                    transition: Bounce,
                });
                console.error("Login error:", err);
            });
    };

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-white px-4">
                <div className="bg-white border border-gray-200 p-10 rounded-2xl shadow-2xl max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Section - Form */}
                    <div className="flex flex-col justify-center">
                        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-500 to-blue-800 bg-clip-text text-transparent">
                            Login to Your Account
                        </h2>

                        <input
                            type="email"
                            placeholder="Email"
                            className="bg-gray-100 text-gray-800 placeholder-gray-500 w-full py-2 px-4 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            className="bg-gray-100 text-gray-800 placeholder-gray-500 w-full py-2 px-4 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <div className="flex justify-between items-center text-sm text-gray-600 mb-6">
                            <label>
                                <input type="checkbox" className="mr-2" /> Remember Me
                            </label>
                            <a href="#" className="hover:underline text-blue-600">
                                Forgot Password?
                            </a>
                        </div>

                        <button
                            onClick={onLogin}
                            className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded-lg font-semibold transition"
                            disabled={isLoading}
                        >
                            {isLoading ? "Logging in..." : "Login to Your Account"}
                        </button>

                        <p className="text-sm text-gray-600 mt-4 text-center">
                            Not a member yet?{" "}
                            <a href="/auth/register" className="text-blue-600 hover:underline">
                                Register Now
                            </a>
                        </p>
                    </div>

                    {/* Right Section - Visuals */}
                    <div className="hidden md:flex items-center justify-center">
                        <img
                            src="/login-visual.png"
                            alt="Login Visual"
                            className="w-[90%] object-contain rounded-xl shadow-md"
                        />
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    );
}
