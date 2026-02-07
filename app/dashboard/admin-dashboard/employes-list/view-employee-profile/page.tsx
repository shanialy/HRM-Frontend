"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import Sidebar from "@/app/components/layout/Sidebar";
import { getRequest } from "@/app/services/api";

type Employee = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  department?: string;
  designation?: string;
  salary?: number;
  userType?: string;
  targetAmount?: number;
  image?: string;
};

type Client = {
  id: number;
  name: string;
  email: string;
};

export default function EmployeeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const employeeId = params.id;

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // 🔹 Dummy clients for sales employees
  const clients: Client[] = [
    { id: 1, name: "Acme Corp", email: "acme@gmail.com" },
    { id: 2, name: "Globex", email: "globex@gmail.com" },
    { id: 3, name: "Initech", email: "initech@gmail.com" },
  ];

  // 🔹 Filter clients (hook must be unconditionally called)
  const filteredClients = useMemo(() => {
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()),
    );
  }, [clients, search]);

  useEffect(() => {
    if (!employeeId) return;

    const fetchEmployee = async () => {
      try {
        const res = await getRequest<{ employee: Employee }>(
          `/employee/getEmployee/${employeeId}`,
        );
        setEmployee(res.data.employee);
      } catch (err) {
        console.error("Failed to fetch employee", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [employeeId]);

  if (loading) return <div>Loading...</div>;
  if (!employee) return <div>Employee not found</div>;

  const fullName = `${employee.firstName} ${employee.lastName}`.trim();
  const isSales =
    /sales/i.test(employee.designation || "") ||
    /sales/i.test(employee.department || "");

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <header className="relative h-14 flex items-center px-6 bg-gray-900/80 border-b border-white/10">
          <h1 className="absolute left-1/2 -translate-x-1/2 text-lg font-semibold">
            Employee Profile
          </h1>
        </header>

        {isSales ? (
          <main className="flex-1 p-6 flex gap-6">
            {/* PROFILE CARD */}
            <div className="w-full max-w-sm bg-gray-900/70 border border-white/10 rounded-xl p-6">
              <div className="flex flex-col items-center text-center">
                <img
                  src={
                    employee.image ||
                    "https://randomuser.me/api/portraits/men/32.jpg"
                  }
                  alt={fullName}
                  className="w-28 h-28 rounded-full border-4 border-white mb-4"
                />
                <h2 className="text-xl font-semibold">{fullName}</h2>
                <p className="text-gray-300">{employee.email}</p>
                <span className="mt-2 bg-green-600 px-4 py-1 rounded-full text-sm">
                  {employee.designation}
                </span>
              </div>

              <div className="mt-6 space-y-2 text-sm text-gray-300">
                <p>📞 Phone: {employee.phone || "Not provided"}</p>
                <p>📍 Address: {employee.address || "Not provided"}</p>
                <p>🏢 Department: {employee.department || "Not provided"}</p>
                <p>💰 Salary: ${employee.salary || 0}</p>
              </div>
            </div>

            {/* CLIENTS SECTION */}
            <div className="flex-1 bg-gray-900/70 border border-white/10 rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Clients</h2>
                <input
                  placeholder="Search clients..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="px-3 py-2 rounded bg-gray-800 border border-white/10"
                />
              </div>

              <div className="space-y-3">
                {filteredClients.map((client) => (
                  <div
                    key={client.id}
                    onClick={() => router.push("/dashboard/conversation-list")}
                    className="p-4 rounded-lg bg-gray-800/70 border border-white/10 hover:bg-gray-700 cursor-pointer"
                  >
                    <p className="font-medium">{client.name}</p>
                    <p className="text-sm text-gray-400">{client.email}</p>
                  </div>
                ))}
              </div>
            </div>
          </main>
        ) : (
          <main className="flex-1 flex justify-center items-center p-6">
            <div className="w-full max-w-md bg-gray-900/70 border border-white/10 rounded-xl p-8">
              <div className="flex flex-col items-center text-center">
                <img
                  src={
                    employee.image ||
                    "https://randomuser.me/api/portraits/men/32.jpg"
                  }
                  alt={fullName}
                  className="w-28 h-28 rounded-full border-4 border-white mb-4"
                />
                <h1 className="text-2xl font-bold">{fullName}</h1>
                <p className="text-gray-300">{employee.email}</p>
                <span className="mt-2 bg-blue-600 px-4 py-1 rounded-full text-sm">
                  {employee.designation}
                </span>
              </div>

              <div className="mt-6 space-y-2 text-sm text-gray-300">
                <p>📞 Phone: {employee.phone || "Not provided"}</p>
                <p>📍 Address: {employee.address || "Not provided"}</p>
                <p>🏢 Department: {employee.department || "Not provided"}</p>
                <p>💰 Salary: ${employee.salary || 0}</p>
              </div>
            </div>
          </main>
        )}
      </div>
    </div>
  );
}
