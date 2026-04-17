"use client";

import Sidebar from "@/app/components/layout/Sidebar";
import { useState, useEffect } from "react";
import { getRequest } from "@/app/services/api";
import { useRouter } from "next/navigation";

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
  workingHours: string;
  notes: string;
}

const formatTime = (timeString: string) => {
  if (!timeString) return "-";

  const date = new Date(timeString);

  return date.toLocaleTimeString("en-US", {
    timeZone: "Asia/Karachi",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export default function ViewMyAttendance() {
  const router = useRouter();
  const currentDate = new Date();

  const currentMonthIndex = currentDate.getMonth();

  const [month, setMonth] = useState(months[currentMonthIndex]);
  const [year, setYear] = useState(currentDate.getFullYear());

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
        }>(`attendance/attendance?month=${monthIndex}&year=${year}`);

        if (res.data.success) {
          const rows = (res.data.data.attendance || []).map((item) => ({
            date: new Date(item.date).toLocaleDateString("en-US", {
              day: "2-digit",
              month: "short",
            }),

            checkIn: item.isLeave
              ? "-"
              : item.time?.checkIn
                ? formatTime(item.time.checkIn)
                : "-",

            checkOut: item.isLeave
              ? "-"
              : item.time?.checkOut
                ? formatTime(item.time.checkOut)
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

            notes: item.notes || "-",
          }));

          setAttendanceData(rows);
        } else {
          setAttendanceData([]);
        }
      } catch (error) {
        setAttendanceData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [month, year]);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="sticky top-0 h-screen">
        <Sidebar />
      </div>

      <div className="flex-1 p-6">
        <h1 className="text-xl font-semibold mb-6">My Attendance</h1>

        <div className="flex items-center mb-6 flex-wrap gap-4">
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

          <button
            onClick={() => {
              router.push(
                `/dashboard/employe-dashboard/attendanceStats?month=${month}&year=${year}`,
              );
            }}
            className="ml-auto cursor-pointer bg-[#EE2737] hover:bg-[#d81f2e] px-6 py-2 rounded-lg text-sm font-medium transition"
          >
            View Stats
          </button>
        </div>

        <div className="bg-gray-900/70 rounded-xl border border-white/10 overflow-hidden">
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
                    <td
                      className={`px-5 py-4 text-center ${
                        row.checkIn !== "-" &&
                        (() => {
                          const [time, modifier] = row.checkIn.split(" ");
                          let [hours, minutes] = time.split(":").map(Number);

                          if (modifier === "PM" && hours !== 12) hours += 12;
                          if (modifier === "AM" && hours === 12) hours = 0;

                          return hours > 21 || (hours === 21 && minutes > 30);
                        })()
                          ? "text-red-400"
                          : "text-green-400"
                      }`}
                    >
                      {row.checkIn}
                    </td>
                    <td className="px-5 py-4 text-center">{row.checkOut}</td>
                    <td className="px-5 py-4 text-center">{row.status}</td>
                    <td
                      className={`text-center ${
                        row.workingHours !== "-" &&
                        row.workingHours !== "..." &&
                        parseInt(row.workingHours) < 8
                          ? "text-red-400"
                          : "text-green-400"
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
