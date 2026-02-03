"use client";

import Sidebar from "@/app/components/layout/Sidebar";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

type Attendance = {
    id: number;
    name: string;
    email: string;
    month: string;
    year: number;
    present: number;
    absent: number;
};

const PAGE_SIZE = 5;

const months = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December",
];

const years = [2024, 2025, 2026, 2027];

const initialAttendance: Attendance[] = [
    {
        id: 1,
        name: "John Smith",
        email: "john@gmail.com",
        month: "January",
        year: 2026,
        present: 20,
        absent: 2,
    },
    {
        id: 2,
        name: "Emily Johnson",
        email: "emily@gmail.com",
        month: "January",
        year: 2026,
        present: 18,
        absent: 4,
    },
];

export default function AttendancePage() {
    const router = useRouter();

    const [attendance] = useState(initialAttendance);
    const [search, setSearch] = useState("");
    const [month, setMonth] = useState("January");
    const [year, setYear] = useState(2026);
    const [page, setPage] = useState(1);

    /* FILTER LOGIC */
    const filteredAttendance = useMemo(() => {
        return attendance.filter(
            (a) =>
                a.month === month &&
                a.year === year &&
                (a.name.toLowerCase().includes(search.toLowerCase()) ||
                    a.email.toLowerCase().includes(search.toLowerCase()))
        );
    }, [attendance, search, month, year]);

    /* PAGINATION */
    const totalPages = Math.max(
        1,
        Math.ceil(filteredAttendance.length / PAGE_SIZE)
    );

    const paginatedAttendance = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        return filteredAttendance.slice(start, start + PAGE_SIZE);
    }, [filteredAttendance, page]);

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            <Sidebar />

            <div className="flex-1 flex flex-col">
                {/* APP BAR */}
                <div className="h-14 flex items-center px-6 bg-gray-900/80 border-b border-white/10">
                    <h1 className="text-lg font-semibold mx-auto">
                        Attendance
                    </h1>

                    <input
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        className="px-3 py-2 rounded-lg text-sm bg-gray-800 border border-white/10"
                    />
                </div>

                {/* FILTERS */}
                <div className="flex flex-wrap gap-4 px-6 py-4">
                    <select
                        value={month}
                        onChange={(e) => {
                            setMonth(e.target.value);
                            setPage(1);
                        }}
                        className="bg-gray-900 border border-white/10 px-4 py-2 rounded-lg text-sm"
                    >
                        {months.map((m) => (
                            <option key={m} value={m}>
                                {m}
                            </option>
                        ))}
                    </select>

                    <select
                        value={year}
                        onChange={(e) => {
                            setYear(Number(e.target.value));
                            setPage(1);
                        }}
                        className="bg-gray-900 border border-white/10 px-4 py-2 rounded-lg text-sm"
                    >
                        {years.map((y) => (
                            <option key={y} value={y}>
                                {y}
                            </option>
                        ))}
                    </select>
                </div>

                {/* TABLE */}
                <main className="flex-1 p-6">
                    <div className="overflow-x-auto bg-gray-900/70 rounded-xl border border-white/10">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-800 text-gray-300">
                                <tr>
                                    <th className="px-5 py-4 text-left">
                                        Name
                                    </th>
                                    <th className="px-5 py-4 text-left">
                                        Email
                                    </th>
                                    <th className="px-5 py-4 text-center">
                                        Present
                                    </th>
                                    <th className="px-5 py-4 text-center">
                                        Absent
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {paginatedAttendance.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-5 py-6 text-center text-gray-400"
                                        >
                                            No records found
                                        </td>
                                    </tr>
                                )}

                                {paginatedAttendance.map((row) => (
                                    <tr
                                        key={row.id}
                                        onClick={() =>
                                            router.push(
                                                `/dashboard/admin-dashboard/employees-attendence/employee-view-attendance`
                                            )
                                        }
                                        className="border-t border-white/10 hover:bg-white/5 cursor-pointer"
                                    >
                                        <td className="px-5 py-4 font-medium">
                                            {row.name}
                                        </td>
                                        <td className="px-5 py-4 text-gray-300">
                                            {row.email}
                                        </td>
                                        <td className="px-5 py-4 text-green-400 text-center">
                                            {row.present}
                                        </td>
                                        <td className="px-5 py-4 text-red-400 text-center">
                                            {row.absent}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* PAGINATION */}
                    <div className="flex justify-end gap-2 mt-2">
                        <button
                            onClick={() => setPage((p) => Math.max(p - 1, 1))}
                            className="px-3 py-1 bg-gray-800 rounded"
                        >
                            Prev
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => setPage(i + 1)}
                                className={`px-3 py-1 rounded ${page === i + 1 ? "bg-[#EE2737]" : "bg-gray-800"}`}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                            className="px-3 py-1 bg-gray-800 rounded"
                        >
                            Next
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
}
