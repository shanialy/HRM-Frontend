"use client";

import { useState } from "react";
import Sidebar from "@/app/components/layout/Sidebar";

export default function AttendancePage() {
    const [selectedDate, setSelectedDate] = useState("");

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">

            {/* SIDEBAR */}
            <Sidebar />

            {/* RIGHT SIDE */}
            <div className="flex-1 flex flex-col">

                {/* APP BAR */}
                <div className="relative h-14 flex items-center px-6
                    bg-gray-900/80 backdrop-blur-md
                    border-b border-white/10 shadow-md">

                    <h1 className="absolute left-1/2 -translate-x-1/2
                        text-lg font-semibold tracking-wide">
                        Attendance
                    </h1>
                </div>

                {/* PAGE CONTENT */}
                <main className="flex-1 flex items-center justify-center p-6">

                    {/* GLASS CARD */}
                    <div className="w-full max-w-md px-8 py-12
                        rounded-2xl
                        bg-gray-900/70 backdrop-blur-xl
                        border border-white/10
                        shadow-2xl">

                        <h2 className="text-2xl font-bold mb-6 text-center">
                            Mark Attendance
                        </h2>

                        {/* DATE PICKER */}
                        <div className="relative">
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg
                                bg-white/10 text-white
                                focus:outline-none focus:ring-2 focus:ring-blue-500
                                appearance-none"
                            />

                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/70">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                            </div>
                        </div>

                        {selectedDate && (
                            <p className="mt-4 text-sm text-gray-300 text-center">
                                Selected Date:{" "}
                                <span className="font-semibold text-white">
                                    {selectedDate}
                                </span>
                            </p>
                        )}

                        <button
                            disabled={!selectedDate}
                            onClick={() =>
                                alert(`Attendance marked for ${selectedDate}`)
                            }
                            className="mt-6 w-full py-3 rounded-xl
                            bg-blue-600 hover:bg-blue-700
                            font-semibold shadow-lg transition
                            disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Mark Attendance
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
}
