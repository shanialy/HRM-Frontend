"use client";

import Sidebar from "@/app/components/layout/Sidebar";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getRequest } from "@/app/services/api";
import { Suspense } from "react";

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

function AttendanceStatsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedMonth, setSelectedMonth] = useState(
    searchParams.get("month") || months[new Date().getMonth()],
  );
  const [selectedYear, setSelectedYear] = useState(
    searchParams.get("year") || String(new Date().getFullYear()),
  );

  const [absent, setAbsent] = useState(0);
  const [late, setLate] = useState(0);
  const [present, setPresent] = useState(0);
  const [leaves, setLeaves] = useState(0);
  const [expectedHours, setExpectedHours] = useState(0);
  const [actualHours, setActualHours] = useState(0);

  const [loading, setLoading] = useState(false);
  const [noData, setNoData] = useState(false);

  const fetchStats = async () => {
    try {
      setLoading(true);

      const monthIndex = months.indexOf(selectedMonth) + 1;
      const yearNum = Number(selectedYear);

      const res = await getRequest<any>(
        `attendance/attendance?month=${monthIndex}&year=${yearNum}`,
      );

      if (res.data.success) {
        const data = res.data.data.attendance || [];

        if (data.length === 0) {
          setNoData(true);
          setAbsent(0);
          setLate(0);
          setPresent(0);
          setLeaves(0);
          setExpectedHours(0);
          setActualHours(0);
          return;
        } else {
          setNoData(false);
        }

        const getWorkingDays = (month: number, year: number) => {
          const today = new Date();
          const isCurrentMonth =
            year === today.getFullYear() && month === today.getMonth() + 1;

          const days = isCurrentMonth
            ? today.getDate()
            : new Date(year, month, 0).getDate();

          let workingDays = 0;

          for (let d = 1; d <= days; d++) {
            const day = new Date(year, month - 1, d).getDay();
            if (day !== 0 && day !== 6) workingDays++;
          }

          return workingDays;
        };

        let totalDays = getWorkingDays(monthIndex, yearNum);

        let presentCount = 0;
        let leaveCount = 0;
        let lateDays = 0;
        let totalWorkedMinutes = 0;

        data.forEach((item: any) => {
          const isPresent =
            !item.isLeave && item.time?.checkIn && item.time?.checkOut;

          if (isPresent) {
            presentCount++;

            const checkIn = new Date(item.time.checkIn);
            const checkOut = new Date(item.time.checkOut);

            const diffMs = checkOut.getTime() - checkIn.getTime();
            const diffMinutes = Math.floor(diffMs / (1000 * 60));
            totalWorkedMinutes += diffMinutes;

            const h = checkIn.getHours();
            const m = checkIn.getMinutes();

            if (h > 21 || (h === 21 && m > 30)) {
              lateDays++;
            }
          }

          if (item.isLeave && item.status === "APPROVED") {
            leaveCount++;
          }
        });

        const absentCount = totalDays - presentCount - leaveCount;
        const lateCount = Math.floor(lateDays / 3);

        const expected = totalDays * 8;
        const actual = (totalWorkedMinutes / 60).toFixed(1);

        setPresent(presentCount);
        setAbsent(absentCount);
        setLate(lateCount);
        setLeaves(leaveCount);
        setExpectedHours(expected);
        setActualHours(Number(actual));
      }
    } catch (err) {
      console.error("Stats error:", err);
      setNoData(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [selectedMonth, selectedYear]);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <Sidebar />

      <div className="flex-1 p-6">
        <button
          onClick={() => router.back()}
          className="mb-4 bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700"
        >
          ← Back
        </button>

        <div className="flex gap-4 mb-6">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-gray-800 px-4 py-2 rounded-lg"
          >
            {months.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-gray-800 px-4 py-2 rounded-lg"
          >
            {Array.from({ length: 5 }).map((_, i) => {
              const y = new Date().getFullYear() - i;
              return <option key={y}>{y}</option>;
            })}
          </select>
        </div>

        <h1 className="text-2xl font-bold mb-6">
          Attendance Stats ({selectedMonth} {selectedYear})
        </h1>

        {loading ? (
          <p>Loading...</p>
        ) : noData ? (
          <p className="text-center py-6 text-gray-400">No records found</p>
        ) : (
          <div className="bg-gray-900/70 rounded-xl border border-white/10 overflow-x-auto">
            <table className="w-full table-fixed text-sm">
              <thead className="bg-gray-800 text-gray-300">
                <tr>
                  <th className="w-1/6 px-4 py-3 text-center">Present</th>
                  <th className="w-1/6 px-4 py-3 text-center">Absent</th>
                  <th className="w-1/6 px-4 py-3 text-center">Leaves</th>
                  <th className="w-1/6 px-4 py-3 text-center">Late-Absent</th>
                  <th className="w-1/6 px-4 py-3 text-center">
                    Expected Hours
                  </th>
                  <th className="w-1/6 px-4 py-3 text-center">Worked Hours</th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-t border-gray-700 text-center">
                  <td className="px-4 py-3 text-green-400 font-semibold">
                    {present}
                  </td>
                  <td className="px-4 py-3 text-red-400 font-semibold">
                    {absent}
                  </td>
                  <td className="px-4 py-3 text-blue-400 font-semibold">
                    {leaves}
                  </td>
                  <td className="px-4 py-3 text-yellow-400 font-semibold">
                    {late}
                  </td>
                  <td className="px-4 py-3 text-purple-400 font-semibold">
                    {expectedHours}h
                  </td>
                  <td className="px-4 py-3 text-cyan-400 font-semibold">
                    {actualHours}h
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AttendanceStatsPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <AttendanceStatsContent />
    </Suspense>
  );
}
