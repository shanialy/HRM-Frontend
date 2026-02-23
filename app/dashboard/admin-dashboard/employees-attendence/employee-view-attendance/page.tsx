"use client";

import Sidebar from "@/app/components/layout/Sidebar";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
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

// Types
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
  date: string;
  checkIn: string;
  checkOut: string;
  status: string;
  notes: string;
}

export default function EmployeeAttendanceDetail() {
  const searchParams = useSearchParams();
  const employeeId = searchParams.get("employeeId");

  const [month, setMonth] = useState("February");
  const [year, setYear] = useState(2026);
  const [attendanceData, setAttendanceData] = useState<AttendanceRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [employeeName, setEmployeeName] = useState("");
  const [employeeEmail, setEmployeeEmail] = useState("");

  useEffect(() => {
    if (!employeeId) return;
    const fetchAttendance = async () => {
      if (!employeeId) return;

      try {
        setLoading(true);

        const monthIndex = months.indexOf(month) + 1;

        const res = await getRequest<{
          status: number;
          success: boolean;
          message: string;
          data: {
            attendance: AttendanceAPI[];
            pagination?: { totalPages: number };
          };
        }>(
          `attendance/attendance/admin?month=${monthIndex}&year=${year}&employeeId=${employeeId}`,
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

          // Employee info from first record
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

    fetchAttendance();
  }, [month, year, employeeId]);

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
            <h1 className="text-xl font-semibold">
              {employeeName || "Employee"}
            </h1>
            <p className="text-sm text-gray-400">{employeeEmail || ""}</p>
          </div>
        </div>

        {/* MONTH & YEAR FILTER */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex flex-col">
            <label className="text-xs text-gray-400 mb-1">Month</label>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="bg-gray-900 border border-white/10 px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
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
              className="bg-gray-900 border border-white/10 px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {[2024, 2025, 2026, 2027].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
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
                <th className="px-5 py-4">Notes</th>
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
