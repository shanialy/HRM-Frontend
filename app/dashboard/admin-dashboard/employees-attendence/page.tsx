"use client";

import Sidebar from "@/app/components/layout/Sidebar";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getRequest } from "@/app/services/api";

// Types
interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface AttendanceAPI {
  _id: string;
  user: User;
  year: number;
  month: number;
  date: string;
  time?: { checkIn?: string; checkOut?: string };
  isLeave: boolean;
  status?: string;
  notes?: string;
}

interface AttendanceRow {
  id: string;
  name: string;
  email: string;
  present: number;
  absent: number;
}

// Constants
const PAGE_SIZE = 5;
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const years = [2024, 2025, 2026, 2027];

export default function AttendancePage() {
  const router = useRouter();

  // States
  const [attendance, setAttendance] = useState<AttendanceRow[]>([]);
  const [search, setSearch] = useState("");
  const [month, setMonth] = useState("February");
  const [year, setYear] = useState(2026);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // API fetch function (like fetchEmployees)
  const fetchAttendance = async (pageNumber = 1) => {
    try {
      setLoading(true);

      // Call API using getRequest helper
      const res = await getRequest<{
        status: number;
        success: boolean;
        message: string;
        data: {
          attendance: AttendanceAPI[];
          pagination: { totalPages: number };
        };
      }>(
        `attendance/attendance/admin?month=${months.indexOf(month) + 1}&year=${year}&page=${pageNumber}&limit=${PAGE_SIZE}`,
      );

      // Map API response to table rows
      const rows: AttendanceRow[] = (res.data.data.attendance || []).map(
        (item) => ({
          id: item.user._id, // <--- important, row.id = user._id
          name: `${item.user.firstName} ${item.user.lastName}`,
          email: item.user.email,
          present: item.isLeave ? 0 : 1,
          absent: item.isLeave ? 1 : 0,
        }),
      );

      setAttendance(rows);
      setTotalPages(res.data.data.pagination?.totalPages || 1);
      setPage(pageNumber);
    } catch (error) {
      console.error("Failed to fetch attendance:", error);
      setAttendance([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // Fetch attendance whenever month, year, or page changes
  useEffect(() => {
    fetchAttendance(page);
  }, [month, year, page]);

  // Filter logic (search)
  const filteredAttendance = useMemo(() => {
    return attendance.filter(
      (a) =>
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.email.toLowerCase().includes(search.toLowerCase()),
    );
  }, [attendance, search]);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* APP BAR */}
        <div className="h-14 flex items-center px-6 bg-gray-900/80 border-b border-white/10">
          <h1 className="text-lg font-semibold mx-auto">Attendance</h1>

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
                  <th className="px-5 py-4 text-left">Name</th>
                  <th className="px-5 py-4 text-left">Email</th>
                  <th className="px-5 py-4 text-center">Present</th>
                  <th className="px-5 py-4 text-center">Absent</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-5 py-6 text-center text-gray-400"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : filteredAttendance.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-5 py-6 text-center text-gray-400"
                    >
                      No records found
                    </td>
                  </tr>
                ) : (
                  filteredAttendance.map((row) => (
                    <tr
                      key={row.id}
                      onClick={() =>
                        router.push(
                          `/dashboard/admin-dashboard/employees-attendence/employee-view-attendance?employeeId=${row.id}`,
                        )
                      }
                      className="border-t border-white/10 hover:bg-white/5 cursor-pointer"
                    >
                      <td className="px-5 py-4 font-medium">{row.name}</td>
                      <td className="px-5 py-4 text-gray-300">{row.email}</td>
                      <td className="px-5 py-4 text-green-400 text-center">
                        {row.present}
                      </td>
                      <td className="px-5 py-4 text-red-400 text-center">
                        {row.absent}
                      </td>
                    </tr>
                  ))
                )}
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
