"use client";

import { useState, useEffect, useRef } from "react";
import Sidebar from "@/app/components/layout/Sidebar";
import { useRouter } from "next/navigation";
import { postRequest, getRequest } from "@/app/services/api";

/* ================= TYPES ================= */

type AttendanceApiResponse = {
  status: number;
  success: boolean;
  message: string;
  data?: {
    attendance?: any;
  };
};

export default function EmployeesDashboard() {
  const router = useRouter();

  /* ================= ANNOUNCEMENTS ================= */
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);

  const getAnnouncements = async () => {
    try {
      const res = await getRequest(
        `/announcements/getAnnouncements?page=1&limit=50`,
      );

      const data: any = res?.data;

      if (data?.success) {
        let list =
          data?.data?.announcements || data?.data || data?.announcements || [];

        list = list.sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );

        setAnnouncements(list);
        setCurrent(0);
      }
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= ATTENDANCE ================= */
  const [selectedDate, setSelectedDate] = useState("");
  const [leaveNotes, setLeaveNotes] = useState("");
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [requestType, setRequestType] = useState("CHECK_IN");
  const [requestDate, setRequestDate] = useState("");
  const [requestTime, setRequestTime] = useState("");
  const [requestNotes, setRequestNotes] = useState("");
  const [showStatus, setShowStatus] = useState(false);
  const [allRecords, setAllRecords] = useState<any[]>([]);
  const [leaveList, setLeaveList] = useState<any[]>([]);

  const fetchTodayAttendance = async () => {
    try {
      setAttendanceLoading(true);

      await getRequest<AttendanceApiResponse>("attendance/attendance/today");

      const res = await getRequest("attendance/attendance");

      const data: any = res?.data;

      if (data?.success) {
        const all = data?.data?.attendance || [];

        const leaves = all.filter((item: any) => item.isLeave === true);

        setLeaveList(leaves);
      }
    } catch (error: any) {
    } finally {
      setAttendanceLoading(false);
    }
  };

  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const today = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Karachi",
    });
    setSelectedDate(today);

    getAnnouncements();
    fetchTodayAttendance();

    const interval = setInterval(() => {
      fetchTodayAttendance();
    }, 30000);

    return () => clearInterval(interval);
  }, []);
  /* ================= ACTIONS ================= */

  const handleCheckIn = async () => {
    try {
      setLoading(true);
      const payload = { type: "CHECK_IN" };

      await postRequest<AttendanceApiResponse>(
        "attendance/attendance",
        payload,
      );

      await fetchTodayAttendance();
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setLoading(true);

      const payload = {
        type: "CHECK_OUT",
        notes: "Checked out from system",
      };

      await postRequest<AttendanceApiResponse>(
        "attendance/attendance",
        payload,
      );

      await fetchTodayAttendance();
    } finally {
      setLoading(false);
    }
  };

  const handleApplyLeave = async () => {
    try {
      if (!selectedDate || !leaveNotes.trim()) return;

      setLoading(true);

      const payload = {
        date: selectedDate,
        notes: leaveNotes,
      };

      await postRequest<AttendanceApiResponse>(
        "attendance/attendance/leave",
        payload,
      );

      setLeaveNotes("");
      await fetchTodayAttendance();
    } finally {
      setLoading(false);
    }
  };

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
        payload,
      );

      setRequestType("CHECK_IN");
      setRequestDate("");
      setRequestTime("");
      setRequestNotes("");
    } finally {
      setLoading(false);
    }
  };

  /* ================= NAV ================= */
  const next = () => {
    if (current + 3 < announcements.length) {
      setCurrent(current + 3);
    }
  };

  const prev = () => {
    if (current > 0) {
      setCurrent(current - 3);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* SIDEBAR (AS IT IS) */}
      <div className="sticky top-0 h-screen">
        <Sidebar />
      </div>

      <div className="flex flex-1">
        {/* MAIN (ATTENDANCE EXACT COPY) */}
        <div className="flex-1 flex flex-col">
          <div className="relative h-14 flex items-center px-6 bg-gray-900/80 border-b border-white/10 shadow-md">
            <h1 className="absolute left-1/2 -translate-x-1/2 text-lg font-semibold">
              Attendance
            </h1>
          </div>

          <main className="flex-1 flex items-center justify-center p-6">
            <div className="w-full max-w-xl p-10 rounded-2xl bg-gray-900/70 border border-white/10 shadow-2xl flex flex-col gap-6">
              <h2 className="text-2xl font-bold text-center text-[#EE2737]">
                Employee Attendance
              </h2>

              <button
                onClick={handleCheckIn}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 font-semibold disabled:opacity-50"
              >
                {loading ? "Processing..." : "Check In"}
              </button>

              <button
                onClick={handleCheckOut}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold disabled:opacity-50"
              >
                {loading ? "Processing..." : "Check Out"}
              </button>

              <div className="border-t border-white/10 my-4"></div>

              <div
                className="relative flex items-center"
                onMouseEnter={() => setShowStatus(true)}
                onMouseLeave={() => setShowStatus(false)}
              >
                <h3 className="text-lg font-semibold text-[#EE2737] mx-auto">
                  Apply Leave
                </h3>

                <button
                  className="absolute right-0 flex items-center gap-1 text-xs font-semibold px-4 py-1.5 rounded-full 
bg-gradient-to-r from-[#EE2737] to-red-500 
hover:from-red-600 hover:to-red-700 
transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  👁 View Status
                </button>

                {showStatus && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-gray-800 border border-white/10 rounded-lg shadow-lg p-3 z-50">
                    {/* ✅ No records */}
                    {!leaveList || leaveList.length === 0 ? (
                      <p className="text-gray-400 text-sm text-center">
                        No record found
                      </p>
                    ) : (
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {leaveList.map((item: any) => (
                          <div
                            key={item._id}
                            className="bg-white/5 p-2 rounded text-xs"
                          >
                            <p>
                              <span className="text-gray-400">Date:</span>{" "}
                              {item.date}
                            </p>

                            <p>
                              <span className="text-gray-400">Status:</span>{" "}
                              <span
                                className={
                                  item.status === "APPROVED"
                                    ? "text-green-400"
                                    : item.status === "REJECTED"
                                      ? "text-red-400"
                                      : "text-yellow-400"
                                }
                              >
                                {item.status}
                              </span>
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

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

        {/* ANNOUNCEMENTS (AS IT IS ORIGINAL) */}
        <div className="w-[320px] h-screen sticky top-0 border-l border-white/10 bg-gray-900/80 p-4 flex flex-col">
          <h2 className="text-center text-lg font-semibold text-[#EE2737] mb-4">
            📢 Announcements
          </h2>

          {announcements.length === 0 ? (
            <p className="text-sm text-gray-400 text-center">
              No announcements
            </p>
          ) : (
            <div className="flex-1 space-y-3 overflow-y-auto pr-2">
              {announcements
                .slice(current, current + 3)
                .map((item: any, index: number) => (
                  <div key={item._id} className="bg-white/5 p-3 rounded-lg">
                    {current === 0 && index === 0 && (
                      <span className="text-[10px] bg-red-500 px-2 py-1 rounded mb-1 inline-block">
                        NEW
                      </span>
                    )}

                    <p className="text-xs text-gray-400">Title</p>
                    <p className="text-sm font-semibold break-words">
                      {item.title}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">Description</p>
                    <p className="text-xs text-gray-300 break-words">
                      {item.description}
                    </p>

                    <p className="text-[10px] text-gray-500 mt-1">
                      {new Date(item.createdAt).toLocaleDateString("en-PK")}
                    </p>
                  </div>
                ))}
            </div>
          )}

          <div className="flex justify-between mt-4">
            <button
              onClick={prev}
              disabled={current === 0}
              className="bg-gray-700 px-3 py-1 rounded disabled:opacity-50"
            >
              Prev
            </button>

            <button
              onClick={next}
              disabled={current + 3 >= announcements.length}
              className="bg-gray-700 px-3 py-1 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
