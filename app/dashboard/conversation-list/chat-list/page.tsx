"use client";

import Sidebar from "@/app/components/layout/Sidebar";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

/* ================= TYPES ================= */
type Chat = {
  id: number;
  name: string;
  lastMessage: string;
  unreadCount: number;
  updatedAt: string;
  avatar: string;
};

const PAGE_SIZE = 6;

/* ================= COMPONENT ================= */
export default function ChatListPage() {
  const router = useRouter();

  const [chats] = useState<Chat[]>([
    {
      id: 1,
      name: "John Smith",
      lastMessage: "Can you share the report?",
      unreadCount: 2,
      updatedAt: "2 min ago",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: 2,
      name: "Emily Johnson",
      lastMessage: "Thanks, got it 👍",
      unreadCount: 0,
      updatedAt: "10 min ago",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      id: 3,
      name: "Sales Team",
      lastMessage: "Meeting at 4 PM",
      unreadCount: 5,
      updatedAt: "1 hr ago",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    },
  ]);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  /* ================= LOGIC ================= */
  const filteredChats = useMemo(() => {
    return chats.filter((chat) =>
      `${chat.name} ${chat.lastMessage}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [chats, search]);

  const totalPages = Math.ceil(filteredChats.length / PAGE_SIZE);

  const paginatedChats = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredChats.slice(start, start + PAGE_SIZE);
  }, [filteredChats, page]);

  /* ================= UI ================= */
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* APP BAR */}
        <div className="relative h-14 flex items-center px-6 bg-gray-900/80 border-b border-white/10">
          <h1 className="absolute left-1/2 -translate-x-1/2 text-lg font-semibold">
            Chats
          </h1>

          <div className="ml-auto">
            <input
              placeholder="Search chats..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 rounded bg-gray-800 border border-white/10"
            />
          </div>
        </div>

        {/* CHAT LIST */}
        <main className="flex-1 p-6">
          <div className="bg-gray-900/70 rounded-xl border border-white/10 overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                {paginatedChats.map((chat) => (
                  <tr
                    key={chat.id}
                    onClick={() => router.push(`/dashboard/conversation-list`)}
                    className="border-t border-white/10 hover:bg-white/5 cursor-pointer"
                  >
                    <td className="px-4 py-4 flex items-center gap-3">
                      <img
                        src={chat.avatar}
                        className="w-10 h-10 rounded-full object-cover"
                      />

                      <div className="flex flex-col">
                        <span className="font-semibold">{chat.name}</span>
                        <span className="text-gray-400 text-xs truncate max-w-xs">
                          {chat.lastMessage}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-right">
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs text-gray-400">
                          {chat.updatedAt}
                        </span>

                        {chat.unreadCount > 0 && (
                          <span className="bg-[#EE2737] text-xs px-2 py-0.5 rounded-full">
                            {chat.unreadCount}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="flex justify-end gap-2 mt-4">
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
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
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
