"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/components/layout/Sidebar";

export default function SettingsPage() {
    const [showDialog, setShowDialog] = useState(false);
    const router = useRouter();

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            {/* SIDEBAR */}
            <Sidebar />

            {/* RIGHT SIDE */}
            <div className="flex-1 flex flex-col min-h-screen">


                {/* APP BAR */}
                <div className="relative h-14 flex items-center px-6
                        bg-gray-900/80 backdrop-blur-md
                        border-b border-white/10 shadow-md">

                    <h1 className="absolute left-1/2 -translate-x-1/2
                         text-lg font-semibold tracking-wide">
                        Settings
                    </h1>
                </div>

                {/* PAGE CONTENT */}
                <main className="flex-1 flex justify-center items-start p-6">
                    <div className="w-full max-w-2xl space-y-8
                          bg-gray-900/70 backdrop-blur-lg
                          border border-white/10
                          rounded-2xl shadow-2xl p-6">

                        {/* ACCOUNT SETTINGS */}
                        <div>
                            <h2 className="text-lg font-semibold mb-4">Account</h2>
                            <ul className="space-y-3">
                                <li>
                                    <button
                                        onClick={() => router.push("/dashboard/settings/change-password")}
                                        className="text-blue-400 hover:text-blue-300 transition"
                                    >
                                        Change Password
                                    </button>
                                </li>
                            </ul>
                        </div>

                        {/* DIVIDER */}
                        <div className="border-t border-white/10" />

                        {/* POLICIES */}
                        <div>
                            <h2 className="text-lg font-semibold mb-4">Policies</h2>
                            <ul className="space-y-3">
                                <li>
                                    <a
                                        href="/dashboard/settings/policies?type=terms"
                                        className="text-blue-400 hover:text-blue-300 transition"
                                    >
                                        Terms & Conditions
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="/dashboard/settings/policies?type=privacy"
                                        className="text-blue-400 hover:text-blue-300 transition"
                                    >
                                        Privacy Policy
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="/dashboard/settings/policies?type=about"
                                        className="text-blue-400 hover:text-blue-300 transition"
                                    >
                                        About Us
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* DIVIDER */}
                        <div className="border-t border-white/10" />

                        {/* DANGER ZONE */}
                        <div>
                            {/* <h2 className="text-lg font-semibold mb-3 text-red-400">
                                Danger Zone
                            </h2> */}

                            <button
                                onClick={() => setShowDialog(true)}
                                className="w-full px-4 py-3
                           bg-red-600 hover:bg-red-700
                           rounded-xl font-semibold
                           shadow-lg transition"
                            >
                                Delete Account
                            </button>
                        </div>
                    </div>
                </main>

                {/* DELETE CONFIRMATION MODAL */}
                {showDialog && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm
                          flex items-center justify-center z-50">

                        <div className="bg-gray-900 text-white
                            w-full max-w-sm
                            p-6 rounded-2xl
                            border border-white/10
                            shadow-2xl">

                            <h3 className="text-lg font-semibold mb-3">
                                Delete Account
                            </h3>

                            <p className="text-gray-300 mb-6 text-sm">
                                Are you sure you want to permanently delete your account?
                                This action cannot be undone.
                            </p>

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setShowDialog(false)}
                                    className="px-4 py-2 rounded-lg
                             bg-gray-700 hover:bg-gray-600 transition"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={() => {
                                        setShowDialog(false);
                                        alert("Account deleted (connect API)");
                                    }}
                                    className="px-4 py-2 rounded-lg
                             bg-red-600 hover:bg-red-700 transition"
                                >
                                    Yes, Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
