"use client";

import { useState } from "react";
import Sidebar from "@/app/components/layout/Sidebar";
import { useRouter } from "next/navigation";
import { postRequest } from "@/app/services/api";

type AttendanceApiResponse = {
  status: number;
  success: boolean;
  message: string;
  data: {
    attendance: {
      user: string;
      _id: string;
    };
  };
};

export default function AttendancePage() {
  const router = useRouter();

  const [selectedDate, setSelectedDate] = useState("");
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [checkOutTime, setCheckOutTime] = useState<string | null>(null);
  const [employeeId, setEmployeeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ================= CHECK IN =================
  const handleCheckIn = async () => {
    try {
      if (!selectedDate) {
        alert("Please select a date first");
        return;
      }

      setLoading(true);

      const now = new Date(selectedDate);

      const payload = {
        type: "CHECK_IN",
        dateTime: now.toISOString(),
      };

      const res = await postRequest<AttendanceApiResponse>(
        "attendance/attendance",
        payload
      );

      const userId = res.data.data.attendance.user;

      setEmployeeId(userId);
      setCheckInTime(new Date().toLocaleTimeString());

      alert(res.data.message);
    } catch (error: any) {
      console.error("Check In Error:", error);
      alert(error?.response?.data?.message || "Failed to check in");
    } finally {
      setLoading(false);
    }
  };

  // ================= CHECK OUT =================
  const handleCheckOut = async () => {
    try {
      setLoading(true);

      const now = new Date();

      const payload = {
        type: "CHECK_OUT",
        dateTime: now.toISOString(),
        notes: "Checked out from system",
      };

      const res = await postRequest<AttendanceApiResponse>(
        "attendance/attendance",
        payload
      );

      setCheckOutTime(now.toLocaleTimeString());

      alert(res.data.message);
    } catch (error: any) {
      console.error("Check Out Error:", error);
      alert(error?.response?.data?.message || "Failed to check out");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* APP BAR */}
        <div className="relative h-14 flex items-center px-6 bg-gray-900/80 border-b border-white/10 shadow-md">
          <h1 className="absolute left-1/2 -translate-x-1/2 text-lg font-semibold">
            Attendance
          </h1>

          <div className="ml-auto">
            <button
              onClick={() =>
                employeeId &&
                router.push(
                  `/dashboard/admin-dashboard/employees-attendence/employee-view-attendance?employeeId=${employeeId}`
                )
              }
              disabled={!employeeId}
              className="px-4 py-2 text-sm rounded-lg bg-[#EE2737] hover:bg-[#d81f2e] transition disabled:opacity-50"
            >
              View Attendance
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md p-10 rounded-2xl bg-gray-900/70 border border-white/10 shadow-2xl flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-center text-[#EE2737]">
              Employee Attendance
            </h2>

            {/* DATE */}
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/10 focus:outline-none"
            />

            {/* BUTTONS */}
            <div className="flex flex-col gap-4 mt-4">
              <button
                onClick={handleCheckIn}
                disabled={!selectedDate || !!checkInTime || loading}
                className="w-full py-3 rounded-xl bg-[#EE2737] hover:bg-[#d0202c] font-semibold disabled:opacity-50"
              >
                {checkInTime
                  ? `Checked In at ${checkInTime}`
                  : loading
                    ? "Processing..."
                    : "Check In"}
              </button>

              <button
                onClick={handleCheckOut}
                disabled={!checkInTime || !!checkOutTime || loading}
                className="w-full py-3 rounded-xl bg-[#EE2737] hover:bg-[#d0202c] font-semibold disabled:opacity-50"
              >
                {checkOutTime
                  ? `Checked Out at ${checkOutTime}`
                  : loading
                    ? "Processing..."
                    : "Check Out"}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
