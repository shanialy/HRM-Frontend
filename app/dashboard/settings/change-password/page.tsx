"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/components/layout/Sidebar";
import { putRequest } from "@/app/services/api";
import Button from "@/app/components/ui/Button";

export default function ChangePasswordPage() {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleChangePassword = async () => {
        setError("");

        if (!oldPassword || !newPassword || !confirmPassword) {
            setError("All fields are required");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("New passwords do not match");
            return;
        }

        if (newPassword.length < 6) {
            setError("New password must be at least 6 characters");
            return;
        }

        try {
            setLoading(true);
            await putRequest("authorization/change-password", {
                oldPassword,
                newPassword,
            });

            alert("Password changed successfully!");
            router.push("/dashboard/settings");
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to change password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            <Sidebar />

            <div className="flex-1 flex flex-col">
                <div className="relative h-14 flex items-center px-6 bg-gray-900/80 border-b border-white/10">
                    <h1 className="absolute left-1/2 -translate-x-1/2 text-lg font-semibold">
                        Change Password
                    </h1>
                </div>

                <main className="flex-1 flex items-center justify-center p-6">
                    <div className="w-full max-w-md bg-gray-900/70 rounded-xl border border-white/10 p-8">
                        <h2 className="text-2xl font-bold mb-6 text-center">
                            Change Password
                        </h2>

                        {error && (
                            <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <input
                                type="password"
                                placeholder="Old Password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#EE2737]"
                            />

                            <input
                                type="password"
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#EE2737]"
                            />

                            <input
                                type="password"
                                placeholder="Confirm New Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#EE2737]"
                            />

                            <Button
                                onClick={handleChangePassword}
                                disabled={loading}
                                className="w-full py-3"
                            >
                                {loading ? "Updating..." : "Update Password"}
                            </Button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
