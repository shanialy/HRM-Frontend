"use client";

import Sidebar from "@/app/components/layout/Sidebar";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getRequest } from "@/app/services/api";

// ================= TYPES =================

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

// ================= CONSTANTS =================

const PAGE_SIZE = 15;

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const years = [2024, 2025, 2026, 2027];

export default function AttendancePage() {
  const router = useRouter();

  const [attendance, setAttendance] = useState<AttendanceRow[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [month, setMonth] = useState("February");
  const [year, setYear] = useState(2026);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // ================= HELPER =================

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month, 0).getDate();
  };

  // ================= FETCH FUNCTION =================

  const fetchAttendance = async () => {
    try {
      setLoading(true);

      // ✅ 1. Fetch ALL employees (no pagination)
      const employeesRes = await getRequest<{
        data: { employees: User[] };
      }>(
        `employee/getAllEmployees?limit=100&search=${search}`
      );

      const allEmployees = employeesRes.data.data.employees || [];

      // ✅ 2. Fetch ALL attendance pages (backend pagination safe)
      let allAttendanceRecords: AttendanceAPI[] = [];
      let currentPage = 1;
      let totalAttendancePages = 1;

      do {
        const res = await getRequest<{
          status: number;
          success: boolean;
          message: string;
          data: {
            attendance: AttendanceAPI[];
            pagination: {
              totalPages: number;
            };
          };
        }>(
          `attendance/attendance/admin?month=${months.indexOf(month) + 1
          }&year=${year}&page=${currentPage}&limit=100`
        );

        const records = res.data.data.attendance || [];

        allAttendanceRecords = [
          ...allAttendanceRecords,
          ...records,
        ];

        totalAttendancePages =
          res.data.data.pagination.totalPages;

        currentPage++;

      } while (currentPage <= totalAttendancePages);

      // ✅ 3. Calculate total days
      const totalDays = getDaysInMonth(
        months.indexOf(month) + 1,
        year
      );

      // ✅ 4. Build attendance map
      const attendanceMap: Record<string, number> = {};

      allAttendanceRecords.forEach((item) => {
        if (!item.isLeave &&
  item.time?.checkIn &&
  item.time?.checkOut) {
          const userId = item.user._id;
          attendanceMap[userId] =
            (attendanceMap[userId] || 0) + 1;
        }
      });

      // ✅ 5. Build final summary rows
      const rows: AttendanceRow[] = allEmployees.map((emp) => {
        const present = attendanceMap[emp._id] || 0;

        return {
          id: emp._id,
          name: `${emp.firstName} ${emp.lastName}`,
          email: emp.email,
          present,
          absent: totalDays - present,
        };
      });

      setAttendance(rows);

      // ✅ 6. Frontend pagination calculate
      const calculatedTotalPages = Math.ceil(
        rows.length / PAGE_SIZE
      );
      setTotalPages(calculatedTotalPages);

    } catch (error) {
      console.error("Failed to fetch attendance:", error);
      setAttendance([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [month, year, search]);

  // ================= FILTER =================

  const filteredAttendance = useMemo(() => {
    return attendance.filter(
      (a) =>
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [attendance, search]);

  // ✅ Apply frontend pagination
  const paginatedAttendance = filteredAttendance.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  // ================= UI =================

  return (
    <div className="h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-y-auto">

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
              <option key={m} value={m}>{m}</option>
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
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

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
                    <td colSpan={4} className="px-5 py-6 text-center text-gray-400">
                      Loading...
                    </td>
                  </tr>
                ) : paginatedAttendance.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-6 text-center text-gray-400">
                      No records found
                    </td>
                  </tr>
                ) : (
                  paginatedAttendance.map((row) => (
                    <tr
                      key={row.id}
                      onClick={() =>
                        router.push(
                          `/dashboard/admin-dashboard/employees-attendence/employee-view-attendance?employeeId=${row.id}`
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

          {/* ✅ Pagination Controls */}
          <div className="flex justify-end gap-2 mt-4">
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
              onClick={() =>
                setPage((p) => Math.min(p + 1, totalPages))
              }
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