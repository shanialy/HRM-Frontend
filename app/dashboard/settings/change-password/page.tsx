"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ChangePasswordPage() {
    const [password, setPassword] = useState("");
    const router = useRouter();

    return (
        <div
            className="min-h-screen flex flex-col bg-cover bg-center"
            style={{
                backgroundImage:
                    "url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1470&q=80')",
            }}
        >
            {/* APP BAR */}
            <div className="h-14 bg-blue-600 flex items-center px-4 relative shadow-lg">
                <button
                    onClick={() => router.back()}
                    className="text-white font-medium hover:bg-white/20 px-3 py-1 rounded transition"
                >
                    ← Back
                </button>

                <h1 className="absolute left-1/2 -translate-x-1/2 text-white font-bold text-lg">
                    Change Password
                </h1>
            </div>

            {/* CENTER CONTAINER */}
            <div className="flex flex-1 items-center justify-center px-4">
                <div className="w-full max-w-md bg-black/40 backdrop-blur-md rounded-2xl shadow-2xl p-8">
                    <h2 className="text-2xl font-bold mb-6 text-white text-center">
                        Change Password
                    </h2>

                    {/* PASSWORD INPUT */}
                    <input
                        type="password"
                        placeholder="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 mb-6 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {/* BUTTON */}
                    <button
                        onClick={() => alert("Password updated!")}
                        className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-[20px] shadow-lg hover:bg-blue-700 transition disabled:opacity-50"
                        disabled={!password}
                    >
                        Update Password
                    </button>
                </div>
            </div>
        </div>
    );
}
