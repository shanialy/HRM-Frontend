"use client";

import Sidebar from "@/app/components/layout/Sidebar";
import Image from "next/image";
import { useState } from "react";

const months = ["January", "February", "March"];

export default function EmployeeAttendanceDetail() {
    const [month, setMonth] = useState("January");
    const [year, setYear] = useState(2026);

    const attendanceData = [
        {
            date: "01 Jan",
            checkIn: "09:05 AM",
            checkOut: "06:01 PM",
            status: "Present",
        },
        {
            date: "02 Jan",
            checkIn: "-",
            checkOut: "-",
            status: "Sick Leave",
        },
    ];

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            <Sidebar />

            <div className="flex-1 p-6">
                {/* HEADER */}
                <div className="flex items-center gap-4 mb-6">
                    <Image
                        src="/avatar.png"
                        alt="Employee"
                        width={64}
                        height={64}
                        className="rounded-full border border-white/20"
                    />
                    <div>
                        <h1 className="text-xl font-semibold">John Smith</h1>
                        <p className="text-sm text-gray-400">
                            john@gmail.com
                        </p>
                    </div>
                </div>

                {/* MONTH FILTER */}
                <div className="flex gap-3 mb-5">
                    <select
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        className="bg-gray-800 border border-white/10 px-3 py-2 rounded"
                    >
                        {months.map((m) => (
                            <option key={m}>{m}</option>
                        ))}
                    </select>

                    <select
                        value={year}
                        onChange={(e) => setYear(+e.target.value)}
                        className="bg-gray-800 border border-white/10 px-3 py-2 rounded"
                    >
                        <option>2025</option>
                        <option>2026</option>
                    </select>
                </div>

                {/* SUMMARY */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-900 p-4 rounded-xl border border-white/10">
                        <p className="text-gray-400 text-sm">Present</p>
                        <p className="text-2xl text-green-400">20</p>
                    </div>
                    <div className="bg-gray-900 p-4 rounded-xl border border-white/10">
                        <p className="text-gray-400 text-sm">Absent</p>
                        <p className="text-2xl text-red-400">2</p>
                    </div>
                    <div className="bg-gray-900 p-4 rounded-xl border border-white/10">
                        <p className="text-gray-400 text-sm">Leaves</p>
                        <p className="text-2xl text-yellow-400">3</p>
                    </div>
                </div>

                {/* TABLE */}
                <div className="bg-gray-900/70 rounded-xl border border-white/10 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-800 text-gray-300">
                            <tr>
                                <th className="px-5 py-4 text-left">Date</th>
                                <th className="px-5 py-4">Check In</th>
                                <th className="px-5 py-4">Check Out</th>
                                <th className="px-5 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendanceData.map((row, i) => (
                                <tr
                                    key={i}
                                    className="border-t border-white/10"
                                >
                                    <td className="px-5 py-4">{row.date}</td>
                                    <td className="px-5 py-4 text-center">
                                        {row.checkIn}
                                    </td>
                                    <td className="px-5 py-4 text-center">
                                        {row.checkOut}
                                    </td>
                                    <td className="px-5 py-4 text-center">
                                        {row.status}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
