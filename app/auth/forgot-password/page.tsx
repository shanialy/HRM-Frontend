"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/app/components/ui/Button"; // import your widget button

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    if (!email) {
      alert("Please enter your email");
      return;
    }

    alert(`Password reset link sent to ${email}`);
  };

  return (
    <main className="min-h-screen flex items-center justify-center text-white bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div
        className="w-[410px] min-h-[380px]
                flex flex-col justify-center
                text-center px-8 py-14 rounded-2xl
                bg-gray-900/80
                backdrop-blur-xl
                shadow-2xl
                border border-gray-700/50"
      >
        <h2 className="text-3xl font-bold mb-4 text-white">Forgot Password</h2>

        <p className="text-gray-400 text-sm mb-6">
          Enter your email and we’ll send you a reset link
        </p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-2
                    rounded-lg
                    bg-white text-gray-900
                    placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-[#EE2737]"
        />

        {/* 🔥 Widget Button */}
        <Button
          onClick={handleSubmit}
          className="w-full py-2 rounded-lg font-semibold"
        >
          Send Reset Link
        </Button>

        <div className="mt-6 text-right">
          <Link
            href="/auth/login"
            className="text-gray-300 font-semibold hover:underline text-sm cursor-pointer"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </main>
  );
}
