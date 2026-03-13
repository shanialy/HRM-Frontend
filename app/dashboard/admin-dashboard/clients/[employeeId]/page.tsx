"use client";

import Sidebar from "@/app/components/layout/Sidebar";
import { getRequest } from "@/app/services/api";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Client = {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  status?: string;
};

export default function EmployeeClientsPage() {
  const params = useParams();
  const employeeId = params.employeeId as string;

  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await getRequest(`employee/employees/${employeeId}`);

        const clientsData = res?.data?.data?.clients || [];

        console.log("CLIENTS DATA:", clientsData);

        // ❌ hide deleted clients (status INACTIVE)
        const activeClients = clientsData.filter(
          (c: Client) => c.status !== "INACTIVE",
        );

        setClients(activeClients);
      } catch (error) {
        console.error("Error fetching clients:", error);
      } finally {
        setLoading(false);
      }
    };

    if (employeeId) {
      fetchClients();
    }
  }, [employeeId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-white">
        Loading clients...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <Sidebar />

      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Assigned Clients</h1>

        <div className="bg-gray-800 p-6 rounded-lg space-y-4">
          {clients.length === 0 ? (
            <p className="text-gray-400">
              No clients assigned to this employee
            </p>
          ) : (
            clients.map((client) => (
              <div
                key={client._id}
                className="flex items-center gap-4 bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition"
              >
                {/* Avatar */}
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-red-600 font-bold">
                  {client.firstName?.charAt(0)}
                  {client.lastName?.charAt(0)}
                </div>

                {/* Client Info */}
                <div>
                  <p className="font-semibold">
                    {client.firstName} {client.lastName}
                  </p>

                  {client.email && (
                    <p className="text-sm text-gray-400">{client.email}</p>
                  )}

                  {client.phone && (
                    <p className="text-sm text-gray-400">📞 {client.phone}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
