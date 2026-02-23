"use client";

import Sidebar from "@/app/components/layout/Sidebar";
import { getRequest } from "@/app/services/api";
import { useRouter } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import { navigateToChat } from "@/app/utills/chatNavigation";

/* ================= TYPES ================= */

type User = {
  id: string;
  name: string;
  role: "admin" | "employee" | "client";
  avatar: string;
};

type EmployeeApi = {
  _id: string;
  firstName: string;
  lastName: string;
};

type ClientApi = {
  _id: string;
  firstName: string;
  lastName: string;
};

export default function SelectChatUserPage() {
  const router = useRouter();

  const [searchEmp, setSearchEmp] = useState("");
  const [searchClient, setSearchClient] = useState("");

  const [employeesData, setEmployeesData] = useState<EmployeeApi[]>([]);
  const [clientsData, setClientsData] = useState<ClientApi[]>([]);

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const empRes = await getRequest<{
        //   success: boolean;
        //   data: { employees: EmployeeApi[] };
        // }>("employee/getAllEmployees");

        const clientRes = await getRequest<{
          success: boolean;
          data: { clients: ClientApi[] };
        }>("client/myclients");

        // if (empRes.data.success) {
        //   setEmployeesData(empRes.data.data.employees);
        // }

        if (clientRes.data.success) {
          setClientsData(clientRes.data.data.clients);
        }
      } catch (error) {
        console.error("API Error:", error);
      }
    };

    fetchData();
  }, []);

  /* ================= FORMAT FOR UI ================= */

  const employees: User[] = useMemo(
    () =>
      employeesData
        .map((emp) => ({
          id: emp._id,
          name: `${emp.firstName} ${emp.lastName}`,
          role: "employee" as const,
          avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        }))
        .filter((u) =>
          u.name.toLowerCase().includes(searchEmp.toLowerCase()),
        ),
    [employeesData, searchEmp],
  );

  const clients: User[] = useMemo(
    () =>
      clientsData
        .map((client) => ({
          id: client._id,
          name: `${client.firstName} ${client.lastName}`,
          role: "client" as const,
          avatar: "https://randomuser.me/api/portraits/men/65.jpg",
        }))
        .filter((u) =>
          u.name.toLowerCase().includes(searchClient.toLowerCase()),
        ),
    [clientsData, searchClient],
  );

  const goToConversation = (user: User) => {
    navigateToChat(user.id, router);
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <Sidebar />

      <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LEFT BOX – EMPLOYEES */}
        <div className="bg-gray-900/70 rounded-xl border border-white/10 flex flex-col">
          <div className="p-4 border-b border-white/10">
            <h2 className="font-semibold mb-2">Employees</h2>
            <input
              placeholder="Search employee..."
              value={searchEmp}
              onChange={(e) => setSearchEmp(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 rounded"
            />
          </div>

          <div className="flex-1 overflow-y-auto">
            {employees.map((user) => (
              <div
                key={user.id}
                onClick={() => goToConversation(user)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 cursor-pointer border-b border-white/5"
              >
                <img
                  src={user.avatar}
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-gray-400">Employee</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT BOX – CLIENTS */}
        <div className="bg-gray-900/70 rounded-xl border border-white/10 flex flex-col">
          <div className="p-4 border-b border-white/10">
            <h2 className="font-semibold mb-2">Clients</h2>
            <input
              placeholder="Search client..."
              value={searchClient}
              onChange={(e) => setSearchClient(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 rounded"
            />
          </div>

          <div className="flex-1 overflow-y-auto">
            {clients.map((user) => (
              <div
                key={user.id}
                onClick={() => goToConversation(user)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 cursor-pointer border-b border-white/5"
              >
                <img
                  src={user.avatar}
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-gray-400">Client</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}