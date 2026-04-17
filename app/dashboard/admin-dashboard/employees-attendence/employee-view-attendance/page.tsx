"use client";

import Sidebar from "@/app/components/layout/Sidebar";
import Image from "next/image";
import { useState, useEffect, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getRequest } from "@/app/services/api";

// Month names
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

interface AttendanceAPI {
  _id: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  date: string;
  time?: { checkIn?: string; checkOut?: string };
  isLeave: boolean;
  status?: string;
  notes?: string;
}

interface AttendanceRow {
  id: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: string;
  workingHours: string;
  notes: string;
}

function EmployeeAttendanceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const employeeId = searchParams.get("employeeId");

  const [month, setMonth] = useState(months[new Date().getMonth()]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [attendanceData, setAttendanceData] = useState<AttendanceRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [employeeName, setEmployeeName] = useState("");
  const [employeeEmail, setEmployeeEmail] = useState("");
  const fetchedRef = useRef(false);

  const isLate = (checkInTime: string) => {
    if (!checkInTime || checkInTime === "-") return false;

    const date = new Date(`1970-01-01 ${checkInTime}`);
    const hours = date.getHours();
    const minutes = date.getMinutes();

    const totalMinutes = hours * 60 + minutes;

    return totalMinutes > 21 * 60 + 30;
  };

  const isOverTime = (checkIn: string, checkOut: string) => {
    if (!checkIn || !checkOut || checkIn === "-" || checkOut === "-")
      return false;

    const start = new Date(`1970-01-01 ${checkIn}`);
    const end = new Date(`1970-01-01 ${checkOut}`);

    if (end < start) {
      end.setDate(end.getDate() + 1);
    }

    const diffMs = end.getTime() - start.getTime();
    const hours = diffMs / (1000 * 60 * 60);

    return hours > 8;
  };

  const fetchAttendance = async () => {
    if (!employeeId) return;

    try {
      setLoading(true);
      const monthIndex = months.indexOf(month) + 1;

      const res = await getRequest<any>(
        `attendance/attendance/admin?month=${monthIndex}&year=${year}&employeeId=${employeeId}`,
      );

      if (res.data.success) {
        const rows = (res.data.data.attendance || []).map(
          (item: AttendanceAPI) => ({
            id: item._id,
            date: new Date(item.date).toLocaleDateString("en-US", {
              day: "2-digit",
              month: "short",
            }),

            checkIn: item.isLeave
              ? "-"
              : item.time?.checkIn
                ? new Date(item.time.checkIn).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })
                : "-",

            checkOut: item.isLeave
              ? "-"
              : item.time?.checkOut
                ? new Date(item.time.checkOut).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })
                : "-",
            workingHours:
              item.time?.checkIn && item.time?.checkOut
                ? (() => {
                    const start = new Date(item.time.checkIn);
                    const end = new Date(item.time.checkOut);
                    if (end < start) {
                      end.setDate(end.getDate() + 1);
                    }

                    const diffMs = end.getTime() - start.getTime();
                    const hours = Math.floor(diffMs / (1000 * 60 * 60));
                    const minutes = Math.floor(
                      (diffMs % (1000 * 60 * 60)) / (1000 * 60),
                    );

                    return `${hours}h ${minutes}m`;
                  })()
                : item.time?.checkIn
                  ? "..."
                  : "-",

            status: item.isLeave
              ? item.status?.toLowerCase() === "pending"
                ? "Applied Leave"
                : item.status?.toLowerCase() === "approved"
                  ? "Leave Approved"
                  : item.status?.toLowerCase() === "rejected"
                    ? "Leave Rejected"
                    : "Applied Leave"
              : item.time?.checkIn && !item.time?.checkOut
                ? "CheckIn"
                : item.time?.checkIn && item.time?.checkOut
                  ? "Present"
                  : "Absent",
            notes: item.notes || "-",
          }),
        );
        setAttendanceData(rows);

        if (res.data.data.attendance.length > 0) {
          setEmployeeName(
            `${res.data.data.attendance[0].user.firstName} ${res.data.data.attendance[0].user.lastName}`,
          );
          setEmployeeEmail(res.data.data.attendance[0].user.email);
        }
      } else {
        setAttendanceData([]);
      }
    } catch (err) {
      console.error("Error fetching attendance:", err);
      setAttendanceData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [month, year, employeeId]);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <Sidebar />

      <div className="flex-1 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gray-200 text-black flex items-center justify-center font-semibold border border-white/20">
            {employeeName
              ? employeeName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
              : "E"}
          </div>
          <div>
            <h1 className="text-xl font-semibold">
              {employeeName || "Employee"}
            </h1>
            <p className="text-sm text-gray-400">{employeeEmail || ""}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          {/* LEFT SIDE (Month + Year) */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex flex-col">
              <label className="text-xs text-gray-400 mb-1">Month</label>
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="bg-gray-900 border border-white/10 px-4 py-2 rounded-lg text-sm"
              >
                {months.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-xs text-gray-400 mb-1">Year</label>
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="bg-gray-900 border border-white/10 px-4 py-2 rounded-lg text-sm"
              >
                {[2024, 2025, 2026, 2027].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* RIGHT SIDE BUTTON */}
          <button
            onClick={() => {
              router.push(
                `/dashboard/admin-dashboard/attendanceStats?employeeId=${employeeId}&month=${month}&year=${year}`,
              );
            }}
            className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg text-sm font-medium transition"
          >
            View Stats
          </button>
        </div>

        <div className="bg-gray-900/70 rounded-xl border border-white/10 max-h-[500px] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-800 text-gray-300">
              <tr>
                <th className="px-5 py-4 text-left">Date</th>
                <th className="px-5 py-4 text-center">Check In</th>
                <th className="px-5 py-4 text-center">Check Out</th>
                <th className="px-5 py-4 text-center">Status</th>
                <th className="px-5 py-4 text-center">Working Hours</th>
                <th className="px-5 py-4 text-center">Notes</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-400">
                    Loading...
                  </td>
                </tr>
              ) : attendanceData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-400">
                    No records found
                  </td>
                </tr>
              ) : (
                attendanceData.map((row, i) => (
                  <tr key={i} className="border-t border-white/10">
                    <td className="px-5 py-4">{row.date}</td>
                    <td
                      className={`px-5 py-4 text-center ${
                        row.checkIn === "-"
                          ? ""
                          : isLate(row.checkIn)
                            ? "text-red-400"
                            : "text-green-400"
                      }`}
                    >
                      {row.checkIn}
                    </td>
                    <td className="px-5 py-4 text-center text-white">
                      {row.checkOut}
                    </td>

                    <td className="px-5 py-4 text-center text-yellow-400">
                      {row.status}
                    </td>

                    <td
                      className={`px-5 py-4 text-center ${
                        row.workingHours === "-" || row.workingHours === "..."
                          ? ""
                          : parseInt(row.workingHours) >= 8
                            ? "text-green-400"
                            : "text-red-400"
                      }`}
                    >
                      {row.workingHours}
                    </td>
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

export default function EmployeeAttendanceDetail() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EmployeeAttendanceContent />
    </Suspense>
  );
}
