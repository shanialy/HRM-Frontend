"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/app/components/ui/Button";
import { postRequest } from "@/app/services/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    setError("");

    if (!email) {
      setError("Please enter your email");
      return;
    }

    try {
      setLoading(true);
      await postRequest("authorization/forgot-password", { email });

      alert("OTP sent to your email!");
      // Navigate to reset password page with email
      router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
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
          Enter your email and we'll send you an OTP
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded text-red-400 text-sm">
            {error}
          </div>
        )}

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

        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-2 rounded-lg font-semibold"
        >
          {loading ? "Sending..." : "Send OTP"}
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
