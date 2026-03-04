"use client";

import Sidebar from "@/app/components/layout/Sidebar";
import { useEffect, useState } from "react";
import { getRequest, patchRequest } from "@/app/services/api";

export default function AttendanceRequestsPage() {

  const [requests, setRequests] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchRequests = async () => {
    try {
      setLoading(true);

      const res: any = await getRequest(
        `attendance/attendance/requests?page=${page}&limit=20`
      );

      console.log(res);
      console.log(res.data);

      setRequests(res.data?.data?.requests || []);
      setTotalPages(res.data?.data?.pagination?.totalPages || 1);

    } catch (error) {
      console.error("Failed to fetch requests", error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [page]);

  /* ================= APPROVE ================= */

  const approveRequest = async (id: string) => {
    try {
      setLoading(true);

      await patchRequest(`attendance/attendance/request/${id}`, {
        status: "APPROVED",
      });

      fetchRequests();

    } catch (error) {
      console.error("Approve failed", error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= REJECT ================= */

  const rejectRequest = async (id: string) => {
    try {
      setLoading(true);

      await patchRequest(`attendance/attendance/request/${id}`, {
        status: "REJECTED",
      });

      fetchRequests();

    } catch (error) {
      console.error("Reject failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-y-auto">

        <div className="h-14 flex items-center px-6 bg-gray-900/80 border-b border-white/10">
          <h1 className="text-lg font-semibold mx-auto">
            Attendance Requests
          </h1>
        </div>

        <main className="flex-1 p-6">

          <div className="bg-gray-900/70 rounded-xl border border-white/10 overflow-x-auto">

            {loading ? (
              <p className="text-gray-400 p-6">Loading...</p>
            ) : requests.length === 0 ? (
              <p className="text-gray-400 p-6">
                No pending attendance requests.
              </p>
            ) : (

              <table className="w-full text-sm">
                <thead className="bg-gray-800 text-gray-300">
                  <tr>
                    <th className="px-5 py-3 text-left">Employee</th>
                    <th className="px-5 py-3 text-left">Email</th>
                    <th className="px-5 py-3 text-center">Type</th>
                    <th className="px-5 py-3 text-center">Date</th>
                    <th className="px-5 py-3 text-center">Time</th>
                    <th className="px-5 py-3 text-left">Reason</th>
                    <th className="px-5 py-3 text-center">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {requests.map((req) => (
                    <tr
                      key={req._id}
                      className="border-t border-white/10 hover:bg-white/5"
                    >
                      <td className="px-5 py-4">
                        {req.user?.firstName} {req.user?.lastName}
                      </td>

                      <td className="px-5 py-4 text-gray-300">
                        {req.user?.email}
                      </td>

                      <td className="px-5 py-4 text-center">
                        {req.type}
                      </td>

                      <td className="px-5 py-4 text-center">
                        {new Date(req.date).toLocaleDateString()}
                      </td>

                      <td className="px-5 py-4 text-center">
                        {new Date(req.time).toLocaleTimeString()}
                      </td>

                      <td className="px-5 py-4">
                        {req.notes}
                      </td>

                      <td className="px-5 py-4 text-center">
                        <div className="flex justify-center gap-2">

                          <button
                            onClick={() => approveRequest(req._id)}
                            className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded"
                          >
                            Approve
                          </button>

                          <button
                            onClick={() => rejectRequest(req._id)}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded"
                          >
                            Reject
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>

            )}

          </div>

          {/* Pagination */}

          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="px-3 py-1 bg-gray-800 rounded"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  page === i + 1 ? "bg-[#EE2737]" : "bg-gray-800"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() =>
                setPage((p) => Math.min(p + 1, totalPages))
              }
              className="px-3 py-1 bg-gray-800 rounded"
            >
              Next
            </button>
          </div>

        </main>
      </div>
    </div>
  );
}