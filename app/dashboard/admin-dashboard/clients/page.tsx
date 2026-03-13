"use client";

import Sidebar from "@/app/components/layout/Sidebar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getRequest } from "@/app/services/api";

type Employee = {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  department?: string;
};

export default function ClientsPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await getRequest(
          "employee/getAllEmployees?page=1&limit=100",
        );

        // employees array
        const employeesData = res?.data?.data?.employees || [];

        // SALES department filter
        const salesEmployees = employeesData.filter(
          (emp: Employee) => emp.department?.toLowerCase() === "sales",
        );

        setEmployees(salesEmployees);
      } catch (err) {
        console.error("Error fetching employees", err);
      }
    };

    fetchEmployees();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <Sidebar />

      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Sales Employees</h1>

        <div className="bg-gray-800 p-6 rounded-lg space-y-4">
          {employees.length === 0 && (
            <p className="text-gray-400">No sales employees found</p>
          )}

          {employees.map((emp) => (
            <div
              key={emp._id}
              className="flex items-center justify-between bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition"
            >
              {/* LEFT SIDE */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-red-600 font-bold">
                  {emp.firstName?.charAt(0)}
                  {emp.lastName?.charAt(0)}
                </div>

                <div>
                  <p className="font-semibold">
                    {emp.firstName} {emp.lastName}
                  </p>
                  <p className="text-sm text-gray-400">{emp.email}</p>
                </div>
              </div>

              {/* RIGHT SIDE BUTTON */}
              <button
                onClick={() =>
                  router.push(`/dashboard/admin-dashboard/clients/${emp._id}`)
                }
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold transition"
              >
                Clients
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
