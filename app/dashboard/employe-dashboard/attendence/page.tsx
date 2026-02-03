"use client";

import { useState, useEffect, useRef } from "react";
import Sidebar from "@/app/components/layout/Sidebar";
import { useRouter } from "next/navigation";

export default function AttendancePage() {
  const router = useRouter();

  const [selectedDate, setSelectedDate] = useState("");
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [checkOutTime, setCheckOutTime] = useState<string | null>(null);
  const [isWorking, setIsWorking] = useState(false);
  const [workTime, setWorkTime] = useState<number>(0);

  const [isOnBreak, setIsOnBreak] = useState(false);
  const [currentBreak, setCurrentBreak] = useState<number>(0);
  const [totalBreakTime, setTotalBreakTime] = useState<number>(0);

  const workTimerRef = useRef<NodeJS.Timeout | null>(null);
  const breakTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Format seconds to hh:mm:ss
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  // Work timer
  useEffect(() => {
    if (isWorking && !isOnBreak) {
      workTimerRef.current = setInterval(() => {
        setWorkTime((prev) => prev + 1);
      }, 1000);
    } else if (!isWorking && workTimerRef.current) {
      clearInterval(workTimerRef.current);
    }
    return () => {
      if (workTimerRef.current) clearInterval(workTimerRef.current);
    };
  }, [isWorking, isOnBreak]);

  // Break timer
  useEffect(() => {
    if (isOnBreak) {
      breakTimerRef.current = setInterval(() => {
        setCurrentBreak((prev) => prev + 1);
      }, 1000);
    } else if (!isOnBreak && breakTimerRef.current) {
      clearInterval(breakTimerRef.current);
    }
    return () => {
      if (breakTimerRef.current) clearInterval(breakTimerRef.current);
    };
  }, [isOnBreak]);

  // ================= HANDLERS =================
  const handleCheckIn = () => {
    const now = new Date();
    setCheckInTime(now.toLocaleTimeString());
    setIsWorking(true);
    alert(`Checked in at ${now.toLocaleTimeString()}`);
  };

  const handleCheckOut = () => {
    const now = new Date();
    setCheckOutTime(now.toLocaleTimeString());
    setIsWorking(false);
    if (isOnBreak) endBreak();
    alert(`Checked out at ${now.toLocaleTimeString()}`);
  };

  const startBreak = () => {
    setIsOnBreak(true);
    setIsWorking(false);
    setCurrentBreak(0);
  };

  const endBreak = () => {
    setIsOnBreak(false);
    setIsWorking(true);
    setTotalBreakTime((prev) => prev + currentBreak);
    setCurrentBreak(0);
  };

  const resetAttendance = () => {
    setCheckInTime(null);
    setCheckOutTime(null);
    setIsWorking(false);
    setWorkTime(0);
    setIsOnBreak(false);
    setCurrentBreak(0);
    setTotalBreakTime(0);
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">
        {/* APP BAR */}
        <div className="relative h-14 flex items-center px-6 bg-gray-900/80 backdrop-blur-md border-b border-white/10 shadow-md">

          {/* Center Title */}
          <h1 className="absolute left-1/2 -translate-x-1/2 text-lg font-semibold tracking-wide">
            Attendance
          </h1>

          {/* Right Button */}

          <div className="ml-auto">
            <button
              onClick={() =>
                router.push(
                  `/dashboard/admin-dashboard/employees-attendence/employee-view-attendance`
                )
              }
              className="px-4 py-2 text-sm rounded-lg bg-[#EE2737] hover:bg-[#d81f2e] transition"
            >
              View Attendance
            </button>
          </div>

        </div>


        {/* PAGE CONTENT */}
        <main className="flex-1 flex items-center justify-center p-6">
          {/* ATTENDANCE CARD */}
          <div className="w-full max-w-md p-10 rounded-2xl bg-gray-900/70 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-center text-[#EE2737]">
              Employee Attendance
            </h2>

            {/* DATE */}
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#EE2737]"
            />

            {/* CHECK-IN / CHECK-OUT */}
            <div className="flex flex-col gap-3 mt-4">
              <button
                onClick={handleCheckIn}
                disabled={!selectedDate || !!checkInTime}
                className="w-full py-3 rounded-xl bg-[#EE2737] hover:bg-[#d0202c] font-semibold shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {checkInTime ? `Checked In at ${checkInTime}` : "Check In"}
              </button>

              <button
                onClick={handleCheckOut}
                disabled={!checkInTime || !!checkOutTime}
                className="w-full py-3 rounded-xl bg-[#EE2737] hover:bg-[#d0202c] font-semibold shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {checkOutTime ? `Checked Out at ${checkOutTime}` : "Check Out"}
              </button>

              {/* BREAK */}
              {!isOnBreak ? (
                <button
                  onClick={startBreak}
                  disabled={!checkInTime || !!checkOutTime}
                  className="w-full py-3 rounded-xl bg-yellow-500 hover:bg-yellow-600 font-semibold shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Start Break
                </button>
              ) : (
                <button
                  onClick={endBreak}
                  className="w-full py-3 rounded-xl bg-yellow-500 hover:bg-yellow-600 font-semibold shadow-lg transition"
                >
                  End Break ({formatTime(currentBreak)})
                </button>
              )}

              {/* TIMERS */}
              <div className="flex flex-col gap-1 mt-2 text-center text-gray-300">
                <p>
                  Total Work Time:{" "}
                  <span className="font-semibold text-white">
                    {formatTime(workTime)}
                  </span>
                </p>
                <p>
                  Total Break Time:{" "}
                  <span className="font-semibold text-white">
                    {formatTime(totalBreakTime + currentBreak)}
                  </span>
                </p>
              </div>

              {/* RESET */}
              {/* <button
                onClick={resetAttendance}
                className="w-full py-2 rounded-xl bg-gray-600 hover:bg-gray-700 font-semibold shadow-lg transition"
              >
                Reset
              </button> */}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
