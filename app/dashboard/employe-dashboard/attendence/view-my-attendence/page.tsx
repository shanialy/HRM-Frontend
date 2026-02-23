"use client";

import Sidebar from "@/app/components/layout/Sidebar";
import { useState, useEffect } from "react";
import { getRequest } from "@/app/services/api";

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

interface AttendanceAPI {
    _id: string;
    user: string;
    date: string;
    time?: { checkIn?: string; checkOut?: string };
    isLeave: boolean;
    status?: string;
    notes?: string;
}

interface AttendanceRow {
    date: string;
    checkIn: string;
    checkOut: string;
    status: string;
    notes: string;
}

export default function ViewMyAttendance() {
    const [month, setMonth] = useState("February");
    const [year, setYear] = useState(2026);
    const [attendanceData, setAttendanceData] = useState<AttendanceRow[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                setLoading(true);

                const monthIndex = months.indexOf(month) + 1;

                const res = await getRequest<{
                    status: number;
                    success: boolean;
                    message: string;
                    data: {
                        attendance: AttendanceAPI[];
                    };
                }>(
                    `attendance/attendance?month=${monthIndex}&year=${year}`
                );

                if (res.data.success) {
                    const rows = (res.data.data.attendance || []).map((item) => ({
                        date: new Date(item.date).toLocaleDateString("en-US", {
                            day: "2-digit",
                            month: "short",
                        }),
                        checkIn: item.time?.checkIn
                            ? new Date(item.time.checkIn).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            })
                            : "-",
                        checkOut: item.time?.checkOut
                            ? new Date(item.time.checkOut).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            })
                            : "-",
                        status: item.isLeave
                            ? "Leave"
                            : item.status
                                ? item.status.charAt(0).toUpperCase() +
                                item.status.slice(1).toLowerCase()
                                : "Present",
                        notes: item.notes || "-",
                    }));

                    setAttendanceData(rows);
                } else {
                    setAttendanceData([]);
                }
            } catch (error) {
                console.error("Fetch Error:", error);
                setAttendanceData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAttendance();
    }, [month, year]);

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            <Sidebar />

            <div className="flex-1 p-6">
                <h1 className="text-xl font-semibold mb-6">My Attendance</h1>

                {/* FILTERS */}
                <div className="flex gap-4 mb-6">
                    <select
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        className="bg-gray-900 border border-white/10 px-4 py-2 rounded-lg"
                    >
                        {months.map((m) => (
                            <option key={m}>{m}</option>
                        ))}
                    </select>

                    <select
                        value={year}
                        onChange={(e) => setYear(Number(e.target.value))}
                        className="bg-gray-900 border border-white/10 px-4 py-2 rounded-lg"
                    >
                        {[2024, 2025, 2026, 2027].map((y) => (
                            <option key={y}>{y}</option>
                        ))}
                    </select>
                </div>

                {/* TABLE */}
                <div className="bg-gray-900/70 rounded-xl border border-white/10 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-800 text-gray-300">
                            <tr>
                                <th className="px-5 py-4 text-left">Date</th>
                                <th className="px-5 py-4 text-center">Check In</th>
                                <th className="px-5 py-4 text-center">Check Out</th>
                                <th className="px-5 py-4 text-center">Status</th>
                                <th className="px-5 py-4 text-center">Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-4 text-gray-400">
                                        Loading...
                                    </td>
                                </tr>
                            ) : attendanceData.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-4 text-gray-400">
                                        No records found
                                    </td>
                                </tr>
                            ) : (
                                attendanceData.map((row, i) => (
                                    <tr key={i} className="border-t border-white/10">
                                        <td className="px-5 py-4">{row.date}</td>
                                        <td className="px-5 py-4 text-center">{row.checkIn}</td>
                                        <td className="px-5 py-4 text-center">{row.checkOut}</td>
                                        <td className="px-5 py-4 text-center">{row.status}</td>
                                        <td className="px-5 py-4 text-center">{row.notes}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}