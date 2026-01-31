"use client";

import Sidebar from "@/app/components/layout/Sidebar";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

/* ================= TYPES ================= */
type User = {
  id: number;
  name: string;
  role: "admin" | "employee" | "client";
  avatar: string;
};

/* ================= COMPONENT ================= */
export default function SelectChatUserPage() {
  const router = useRouter();

  const [searchEmp, setSearchEmp] = useState("");
  const [searchClient, setSearchClient] = useState("");

  const users: User[] = [
    {
      id: 1,
      name: "Admin",
      role: "admin",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    {
      id: 2,
      name: "John Smith",
      role: "employee",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: 3,
      name: "Emily Johnson",
      role: "employee",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      id: 4,
      name: "Michael Client",
      role: "client",
      avatar: "https://randomuser.me/api/portraits/men/65.jpg",
    },
    {
      id: 5,
      name: "Sarah Client",
      role: "client",
      avatar: "https://randomuser.me/api/portraits/women/22.jpg",
    },
  ];

  /* ================= FILTERING ================= */
  const employees = useMemo(
    () =>
      users.filter(
        (u) =>
          (u.role === "admin" || u.role === "employee") &&
          u.name.toLowerCase().includes(searchEmp.toLowerCase()),
      ),
    [searchEmp, users],
  );

  const clients = useMemo(
    () =>
      users.filter(
        (u) =>
          u.role === "client" &&
          u.name.toLowerCase().includes(searchClient.toLowerCase()),
      ),
    [searchClient],
  );

  const goToConversation = (user: User) => {
    router.push(`/dashboard/conversation-list`);
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <Sidebar />

      <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LEFT BOX – ADMIN + EMPLOYEES */}
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
                  <p className="text-xs text-gray-400 capitalize">
                    {user.role === "admin" ? "Admin (Pinned)" : "Employee"}
                  </p>
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
