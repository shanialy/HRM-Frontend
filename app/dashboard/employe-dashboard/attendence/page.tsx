"use client";

import { useState } from "react";
import Sidebar from "@/app/components/layout/Sidebar";
import { useRouter } from "next/navigation";
import { postRequest } from "@/app/services/api";

type AttendanceApiResponse = {
  status: number;
  success: boolean;
  message: string;
  data?: any;
};

export default function AttendancePage() {
  const router = useRouter();

  const [selectedDate, setSelectedDate] = useState("");
  const [leaveNotes, setLeaveNotes] = useState("");
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [checkOutTime, setCheckOutTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ================= CHECK IN =================
  const handleCheckIn = async () => {
    try {
      if (!selectedDate) {
        alert("Please select a date first");
        return;
      }

      setLoading(true);

      const payload = {
        type: "CHECK_IN",
        dateTime: new Date(selectedDate).toISOString(),
      };

      const res = await postRequest<AttendanceApiResponse>(
        "attendance/attendance",
        payload
      );

      setCheckInTime(new Date().toLocaleTimeString());
      alert(res.data.message);
    } catch (error: any) {
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
      alert(error?.response?.data?.message || "Failed to check out");
    } finally {
      setLoading(false);
    }
  };

  // ================= APPLY LEAVE =================
  const handleApplyLeave = async () => {
    try {
      if (!selectedDate) {
        alert("Please select a leave date");
        return;
      }

      if (!leaveNotes.trim()) {
        alert("Leave notes are required");
        return;
      }

      setLoading(true);

      const payload = {
        date: new Date(selectedDate).toISOString(),
        notes: leaveNotes,
      };

      const res = await postRequest<AttendanceApiResponse>(
        "attendance/attendance/leave",
        payload
      );

      alert(res.data.message);
      setLeaveNotes("");
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to apply leave");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <div className="relative h-14 flex items-center px-6 bg-gray-900/80 border-b border-white/10 shadow-md">
          <h1 className="absolute left-1/2 -translate-x-1/2 text-lg font-semibold">
            Attendance
          </h1>

          <div className="ml-auto">
            <button
              onClick={() =>
                router.push(
                  `/dashboard/employe-dashboard/attendence/view-my-attendence`
                )
              }
              className="px-4 py-2 text-sm rounded-lg bg-[#EE2737] hover:bg-[#d81f2e] transition"
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

            {/* CHECK IN / OUT */}
            <div className="flex flex-col gap-4 mt-2">
              <button
                onClick={handleCheckIn}
                disabled={!selectedDate || !!checkInTime || loading}
                className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 font-semibold disabled:opacity-50"
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
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold disabled:opacity-50"
              >
                {checkOutTime
                  ? `Checked Out at ${checkOutTime}`
                  : loading
                    ? "Processing..."
                    : "Check Out"}
              </button>
            </div>

            {/* DIVIDER */}
            <div className="border-t border-white/10 my-4"></div>

            {/* APPLY LEAVE */}
            <h3 className="text-lg font-semibold text-[#EE2737]">
              Apply Leave
            </h3>

            <textarea
              placeholder="Enter leave reason (required)"
              value={leaveNotes}
              onChange={(e) => setLeaveNotes(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/10 focus:outline-none resize-none"
              rows={3}
            />

            <button
              onClick={handleApplyLeave}
              disabled={!selectedDate || loading}
              className="w-full py-3 rounded-xl bg-[#EE2737] hover:bg-[#d0202c] font-semibold disabled:opacity-50"
            >
              {loading ? "Processing..." : "Apply Leave"}
            </button>

          </div>
        </main>
      </div>
    </div>
  );
}