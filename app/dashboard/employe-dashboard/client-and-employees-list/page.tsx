"use client";

import Sidebar from "@/app/components/layout/Sidebar";
import { getRequest } from "@/app/services/api";
import { useRouter } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import { navigateToChat } from "@/app/utills/chatNavigation";
import { chatService, Conversation } from "@/app/services/chat.service";
import { useAppSelector } from "@/app/dashboard/redux/hooks";

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
  const currentUser = useAppSelector((state) => state.auth.user);

  const [searchEmp, setSearchEmp] = useState("");
  const [searchClient, setSearchClient] = useState("");

  const [employeesData, setEmployeesData] = useState<EmployeeApi[]>([]);
  const [clientsData, setClientsData] = useState<ClientApi[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientRes = await getRequest<{
          success: boolean;
          data: { clients: ClientApi[] };
        }>("client/myclients");

        if (clientRes.data.success) {
          setClientsData(clientRes.data.data.clients);
        }
      } catch (error) {
        console.error("API Error:", error);
      }
    };

    fetchData();

    // Fetch conversations to filter employees
    chatService.getConversations(1, 100, (data) => {
      setConversations(data);
    });

    return () => {
      chatService.removeListener("conversations");
    };
  }, []);

  /* ================= FORMAT FOR UI ================= */

  // Only show employees with whom there's an active conversation
  const employees: User[] = useMemo(() => {
    if (!currentUser) return [];

    // Get all employee IDs from conversations
    const employeeIdsWithChat = conversations
      .flatMap((conv) => conv.participants)
      .filter((p) => p._id !== currentUser._id && p.role === "EMPLOYEE")
      .map((p) => ({
        id: p._id,
        name: `${p.firstName} ${p.lastName}`,
        role: "employee" as const,
        avatar: p.profilePicture || "https://randomuser.me/api/portraits/men/32.jpg",
      }));

    // Remove duplicates
    const uniqueEmployees = Array.from(
      new Map(employeeIdsWithChat.map((emp) => [emp.id, emp])).values()
    );

    return uniqueEmployees.filter((u) =>
      u.name.toLowerCase().includes(searchEmp.toLowerCase())
    );
  }, [conversations, currentUser, searchEmp]);

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
            <h2 className="font-semibold mb-2">Employees (Active Chats)</h2>
            <input
              placeholder="Search employee..."
              value={searchEmp}
              onChange={(e) => setSearchEmp(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 rounded"
            />
          </div>

          <div className="flex-1 overflow-y-auto">
            {employees.length === 0 ? (
              <div className="p-4 text-center text-gray-400">
                No active chats with employees
              </div>
            ) : (
              employees.map((user) => (
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
              ))
            )}
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