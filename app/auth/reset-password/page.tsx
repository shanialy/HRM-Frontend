"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/app/components/ui/Button";
import { postRequest } from "@/app/services/api";

export default function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const emailParam = searchParams.get("email");
        if (emailParam) {
            setEmail(decodeURIComponent(emailParam));
        }
    }, [searchParams]);

    const handleSubmit = async () => {
        setError("");

        if (!email || !otp || !newPassword || !confirmPassword) {
            setError("All fields are required");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        try {
            setLoading(true);
            await postRequest("authorization/reset-password", {
                email,
                otp,
                newPassword,
            });

            alert("Password reset successfully!");
            router.push("/auth/login");
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center text-white bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <div
                className="w-[410px] min-h-[500px]
                flex flex-col justify-center
                text-center px-8 py-14 rounded-2xl
                bg-gray-900/80
                backdrop-blur-xl
                shadow-2xl
                border border-gray-700/50"
            >
                <h2 className="text-3xl font-bold mb-4 text-white">Reset Password</h2>

                <p className="text-gray-400 text-sm mb-6">
                    Enter the OTP sent to your email and your new password
                </p>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2
                      rounded-lg
                      bg-white text-gray-900
                      placeholder-gray-400
                      focus:outline-none focus:ring-2 focus:ring-[#EE2737]"
                    />

                    <input
                        type="text"
                        placeholder="OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full px-4 py-2
                      rounded-lg
                      bg-white text-gray-900
                      placeholder-gray-400
                      focus:outline-none focus:ring-2 focus:ring-[#EE2737]"
                    />

                    <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-2
                      rounded-lg
                      bg-white text-gray-900
                      placeholder-gray-400
                      focus:outline-none focus:ring-2 focus:ring-[#EE2737]"
                    />

                    <input
                        type="password"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-2
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
                        {loading ? "Resetting..." : "Reset Password"}
                    </Button>
                </div>

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
