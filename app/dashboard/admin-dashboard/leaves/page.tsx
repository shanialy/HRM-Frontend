"use client";

import Sidebar from "@/app/components/layout/Sidebar";
import { useEffect, useState } from "react";
import { getRequest, patchRequest } from "@/app/services/api";

interface LeaveRow {
  id: string;
  employee: string;
  email: string;
  date: string;
  reason: string;
  status: string;
}

export default function LeavesPage() {
  const [leaves, setLeaves] = useState<LeaveRow[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLeaves = async () => {
    try {
      setLoading(true);

      const res = await getRequest<any>(
        `attendance/attendance/admin`
      );

      const data = res.data?.data?.attendance || [];

      // ✅ Sirf leave records
      const leaveRows: LeaveRow[] = data
        .filter((item: any) => item.isLeave)
        .map((item: any) => ({
          id: item._id,
          employee: `${item.user.firstName} ${item.user.lastName}`,
          email: item.user.email,
          date: new Date(item.date).toLocaleDateString(),
          reason: item.notes || "-",
          status: item.status || "PENDING",
        }));

      setLeaves(leaveRows);
    } catch (err) {
     console.error("Failed to fetch leaves:", err);
      setLeaves([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Approve / Reject Leave
  const handleLeaveAction = async (id: string, status: string) => {
    try {
      await patchRequest(`attendance/attendance/leave/${id}`, { status });

      // refresh list
      fetchLeaves();
    } catch (err) {
      console.error("Leave update failed:", err);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  return (
    <div className="h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <Sidebar />

      <div className="flex-1 p-6">
        <h1 className="text-xl font-semibold mb-6">Leave Requests</h1>

        <div className="bg-gray-900/70 border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-800 text-gray-300">
              <tr>
                <th className="px-5 py-4 text-left">Employee</th>
                <th className="px-5 py-4 text-left">Email</th>
                <th className="px-5 py-4 text-center">Date</th>
                <th className="px-5 py-4 text-center">Reason</th>
                <th className="px-5 py-4 text-center">Status</th>
                <th className="px-5 py-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-400">
                    Loading...
                  </td>
                </tr>
              ) : leaves.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-400">
                    No leave requests
                  </td>
                </tr>
              ) : (
                leaves.map((leave) => (
                  <tr
                    key={leave.id}
                    className="border-t border-white/10"
                  >
                    <td className="px-5 py-4">{leave.employee}</td>
                    <td className="px-5 py-4">{leave.email}</td>
                    <td className="px-5 py-4 text-center">{leave.date}</td>
                    <td className="px-5 py-4 text-center">{leave.reason}</td>

                    <td className="px-5 py-4 text-center">
                      <span
                        className={
                          leave.status === "APPROVED"
                            ? "text-green-400"
                            : leave.status === "REJECTED"
                            ? "text-red-400"
                            : "text-yellow-400"
                        }
                      >
                        {leave.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-center">
                      {leave.status === "PENDING" && (
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() =>
                              handleLeaveAction(leave.id, "APPROVED")
                            }
                            className="bg-green-600 px-3 py-1 rounded text-xs"
                          >
                            Approve
                          </button>

                          <button
                            onClick={() =>
                              handleLeaveAction(leave.id, "REJECTED")
                            }
                            className="bg-red-600 px-3 py-1 rounded text-xs"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
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