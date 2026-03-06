"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/app/components/layout/Sidebar";
import { useRouter } from "next/navigation";
import { postRequest, getRequest } from "@/app/services/api";

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

  const [hasCheckedIn, setHasCheckedIn] = useState(false);

  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const [requestType, setRequestType] = useState("CHECK_IN");
  const [requestDate, setRequestDate] = useState("");
  const [requestTime, setRequestTime] = useState("");
  const [requestNotes, setRequestNotes] = useState("");

  /* ================= FETCH TODAY ATTENDANCE ================= */

  const fetchTodayAttendance = async () => {
    try {
      setAttendanceLoading(true);

      const res = await getRequest<AttendanceApiResponse>(
        "attendance/attendance/today"
      );

      const attendance = res?.data?.data;

      if (!attendance) {
        setCheckInTime(null);
        setCheckOutTime(null);
        setHasCheckedIn(false);
        return;
      }

      const checkIn = attendance?.time?.checkIn || null;
      const checkOut = attendance?.time?.checkOut || null;

      setCheckInTime(checkIn);
      setCheckOutTime(checkOut);

      if (checkIn && !checkOut) {
        setHasCheckedIn(true);
      } else {
        setHasCheckedIn(false);
      }
    } catch (error) {
      console.log("Attendance fetch error", error);
    } finally {
      setAttendanceLoading(false);
    }
  };

  /* ================= INITIAL LOAD ================= */

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);

    fetchTodayAttendance();

    const interval = setInterval(() => {
      fetchTodayAttendance();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  /* ================= CHECK IN ================= */

  const handleCheckIn = async () => {
    try {
      setLoading(true);

      const payload = {
        type: "CHECK_IN",
      };

      await postRequest<AttendanceApiResponse>(
        "attendance/attendance",
        payload
      );

      await fetchTodayAttendance();
    } catch (error: any) {
      console.log(error?.response?.data);
    } finally {
      setLoading(false);
    }
  };

  /* ================= CHECK OUT ================= */

  const handleCheckOut = async () => {
    try {
      setLoading(true);

      const payload = {
        type: "CHECK_OUT",
        notes: "Checked out from system",
      };

      await postRequest<AttendanceApiResponse>(
        "attendance/attendance",
        payload
      );

      await fetchTodayAttendance();
    } catch (error: any) {
      console.log(error?.response?.data);
    } finally {
      setLoading(false);
    }
  };

  /* ================= APPLY LEAVE ================= */

  const handleApplyLeave = async () => {
    try {
      if (!selectedDate || !leaveNotes.trim()) return;

      setLoading(true);

      const payload = {
        date: new Date(selectedDate).toISOString(),
        notes: leaveNotes,
      };

      await postRequest<AttendanceApiResponse>(
        "attendance/attendance/leave",
        payload
      );

      setLeaveNotes("");
    } catch (error: any) {
      console.log(error?.response?.data);
    } finally {
      setLoading(false);
    }
  };

  /* ================= ATTENDANCE REQUEST ================= */

  const handleSubmitAttendanceRequest = async () => {
    try {
      if (!requestDate || !requestTime || !requestNotes.trim()) return;

      setLoading(true);

      const dateTime = new Date(`${requestDate}T${requestTime}`);

      const payload = {
        type: requestType,
        date: new Date(requestDate).toISOString(),
        time: dateTime.toISOString(),
        notes: requestNotes,
      };

      await postRequest<AttendanceApiResponse>(
        "attendance/attendance/request",
        payload
      );

      setRequestType("CHECK_IN");
      setRequestDate("");
      setRequestTime("");
      setRequestNotes("");
    } catch (error: any) {
      console.log(error?.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="sticky top-0 h-screen">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col">
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

        <main className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-xl p-10 rounded-2xl bg-gray-900/70 border border-white/10 shadow-2xl flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-center text-[#EE2737]">
              Employee Attendance
            </h2>

            {/* CHECK IN */}
            <button
              onClick={handleCheckIn}
              disabled={hasCheckedIn || loading || attendanceLoading}
              className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 font-semibold disabled:opacity-50"
            >
              {checkInTime
                ? `Checked In at ${new Date(checkInTime).toLocaleTimeString(
                    "en-PK",
                    {
                      timeZone: "Asia/Karachi",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}`
                : loading
                ? "Processing..."
                : "Check In"}
            </button>

            {/* CHECK OUT */}
            <button
              onClick={handleCheckOut}
              disabled={!hasCheckedIn || !!checkOutTime || loading}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold disabled:opacity-50"
            >
              {checkOutTime
                ? `Checked Out at ${new Date(checkOutTime).toLocaleTimeString(
                    "en-PK",
                    {
                      timeZone: "Asia/Karachi",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}`
                : loading
                ? "Processing..."
                : "Check Out"}
            </button>

            <div className="border-t border-white/10 my-4"></div>

            {/* APPLY LEAVE */}
            <h3 className="text-lg font-semibold text-[#EE2737]">
              Apply Leave
            </h3>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/10 focus:outline-none"
            />

            <textarea
              placeholder="Enter leave reason"
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

            <div className="border-t border-white/10 my-4"></div>

            {/* REQUEST */}
            <h3 className="text-lg font-semibold text-[#EE2737]">
              Attendance Correction Request
            </h3>

            <select
              value={requestType}
              onChange={(e) => setRequestType(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/10"
            >
              <option value="CHECK_IN">Check In</option>
              <option value="CHECK_OUT">Check Out</option>
            </select>

            <input
              type="date"
              value={requestDate}
              onChange={(e) => setRequestDate(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/10"
            />

            <input
              type="time"
              value={requestTime}
              onChange={(e) => setRequestTime(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/10"
            />

            <textarea
              placeholder="Enter reason"
              value={requestNotes}
              onChange={(e) => setRequestNotes(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-lg bg-white/10 resize-none"
            />

            <button
              onClick={handleSubmitAttendanceRequest}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-yellow-600 hover:bg-yellow-700 font-semibold disabled:opacity-50"
            >
              {loading ? "Processing..." : "Submit Request"}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}