"use client";

import { useState } from "react";
import { toast, Bounce, ToastContainer } from "react-toastify";
import API from "@/app/utils/API";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

export default function Register() {
    const [email, setEmail] = useState("");
    const [fullName, setFullName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const onRegister = () => {
        if (password !== confirmPassword) {
            toast.error("Passwords do not match!", {
                position: "top-center",
                theme: "light",
                transition: Bounce,
            });
            return;
        }

        setIsLoading(true);
        API.post("/auth/register", {
            email,
            fullName,
            password,
        })
            .then((res) => {
                setIsLoading(false);
                toast.success("Registration successful!", {
                    position: "top-center",
                    theme: "light",
                    transition: Bounce,
                });
            })
            .catch((err) => {
                setIsLoading(false);
                toast.error(err.response?.data?.message || "Registration failed!", {
                    position: "top-center",
                    theme: "light",
                    transition: Bounce,
                });
            });
    };

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-2xl w-full max-w-md">
                    <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-500 to-blue-800 bg-clip-text text-transparent">
                        Create an Account
                    </h2>

                    <input
                        type="text"
                        placeholder="Full Name"
                        className="bg-gray-100 text-gray-800 placeholder-gray-500 w-full py-2 px-4 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                    />

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

                    <input
                        type="password"
                        placeholder="Confirm Password"
                        className="bg-gray-100 text-gray-800 placeholder-gray-500 w-full py-2 px-4 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    <button
                        onClick={onRegister}
                        className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded-lg font-semibold transition"
                        disabled={isLoading}
                    >
                        {isLoading ? "Registering..." : "Create Account"}
                    </button>

                    <p className="text-sm text-gray-600 mt-4 text-center">
                        Already have an account?{" "}
                        <Link href="/auth/login" className="text-blue-600 hover:underline">
                            Login here
                        </Link>
                    </p>
                </div>
            </div>
            <ToastContainer />
        </>
    );
}
