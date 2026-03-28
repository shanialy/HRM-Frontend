"use client";

import Sidebar from "@/app/components/layout/Sidebar";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getRequest } from "@/app/services/api";

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
  date: string;
  time?: { checkIn?: string; checkOut?: string };
  isLeave: boolean;
  status?: string;
}

export default function AttendanceStatsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const employeeId = searchParams.get("employeeId");
  const month = searchParams.get("month");
  const year = searchParams.get("year");

  const [absent, setAbsent] = useState(0);
  const [late, setLate] = useState(0);
  const [loading, setLoading] = useState(false);
  const [noData, setNoData] = useState(false); // ⭐ NEW STATE

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month, 0).getDate();
  };

  const fetchStats = async () => {
    if (!employeeId) return;

    try {
      setLoading(true);

      const monthIndex = month
        ? months.indexOf(month) + 1
        : new Date().getMonth() + 1;

      const selectedYear = year ? Number(year) : new Date().getFullYear();

      const res = await getRequest<any>(
        `attendance/attendance/admin?month=${monthIndex}&year=${selectedYear}&employeeId=${employeeId}`,
      );

      if (res.data.success) {
        const data: AttendanceAPI[] = res.data.data.attendance || [];

        // ⭐ FIX: NO RECORD CASE
        if (data.length === 0) {
          setNoData(true);
          setAbsent(0);
          setLate(0);
          return;
        } else {
          setNoData(false);
        }

        // ✅ TOTAL DAYS
        let totalDays = getDaysInMonth(monthIndex, selectedYear);

        const today = new Date();

        if (
          selectedYear === today.getFullYear() &&
          monthIndex === today.getMonth() + 1
        ) {
          totalDays = today.getDate();
        }

        // ✅ counters
        let present = 0;
        let leave = 0;
        let lateDays = 0;

        data.forEach((item) => {
          const isPresent =
            !item.isLeave && item.time?.checkIn && item.time?.checkOut;

          // ✅ PRESENT
          if (isPresent) {
            present++;

            // ⏰ LATE (after 9:30 PM)
            if (item.time?.checkIn) {
              const checkIn = new Date(item.time.checkIn);
              const h = checkIn.getHours();
              const m = checkIn.getMinutes();

              if (h > 21 || (h === 21 && m > 30)) {
                lateDays++;
              }
            }
          }

          // ✅ LEAVE
          if (item.isLeave && item.status === "APPROVED") {
            leave++;
          }
        });

        // ✅ FINAL CALCULATIONS
        const absentCount = totalDays - present - leave;
        const lateCount = Math.floor(lateDays / 3);

        setAbsent(absentCount);
        setLate(lateCount);
      }
    } catch (err) {
      console.error("Stats error:", err);
      setNoData(true); // error case → treat like no data
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [employeeId, month, year]);

  return (
    <div className="min-h-screen flex bg-gray-900 text-white">
      <Sidebar />

      <div className="flex-1 p-6">
        {/* 🔙 BACK */}
        <button
          onClick={() => router.back()}
          className="mb-4 bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700"
        >
          ← Back
        </button>

        {/* 🔥 Heading */}
        <h1 className="text-2xl font-bold mb-6">
          Attendance Stats ({month} {year})
        </h1>

        {/* 📊 CONTENT */}
        {loading ? (
          <p>Loading...</p>
        ) : noData ? (
          <p className="text-center py-6 text-gray-400">No records found</p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800 p-4 rounded-xl">
              <p className="text-gray-400 text-sm">Total Absent</p>
              <h2 className="text-xl font-bold text-red-400">{absent}</h2>
            </div>

            <div className="bg-gray-800 p-4 rounded-xl">
              <p className="text-gray-400 text-sm">Late Count</p>
              <h2 className="text-xl font-bold text-yellow-400">{late}</h2>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
