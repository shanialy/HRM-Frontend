"use client";

import socketService from "@/app/services/socket.service";
import dynamic from "next/dynamic";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { chatService, Conversation } from "@/app/services/chat.service";
import { useAppSelector } from "@/app/dashboard/redux/hooks";

const Sidebar = dynamic(
  () => import("@/app/components/layout/Sidebar"),
  { ssr: false }
);

const PAGE_SIZE = 6;

export default function ChatListPage() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  console.log("USER DATA:", user); 
  const token = useAppSelector((state) => state.auth.token);

  const [chats, setChats] = useState<Conversation[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [userSearch, setUserSearch] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // ✅ CLIENT SEARCH STATES
  const [clientSearch, setClientSearch] = useState("");
  const [clientResults, setClientResults] = useState<any[]>([]);

  // ================= EMPLOYEE SEARCH =================
  const handleUserSearch = (value: string) => {
    setUserSearch(value);

    if (!value.trim()) {
      setSearchResults([]);
      return;
    }

    chatService.searchUsers(value, (users: any[]) => {
      // ✅ CLIENT ko remove kar diya
      const employeesOnly = users.filter(
        (u) => u.role !== "CLIENT"
      );
      setSearchResults(employeesOnly);
    });
  };

  // ================= CLIENT SEARCH =================
  const handleClientSearch = (value: string) => {
    setClientSearch(value);

    if (!value.trim()) {
      setClientResults([]);
      return;
    }

    chatService.searchUsers(value, (users: any[]) => {
      // ✅ Sirf CLIENT role
      const clientsOnly = users.filter(
        (u) => u.role === "CLIENT"
      );
      setClientResults(clientsOnly);
    });
  };

  // ================= FETCH WHEN SOCKET READY =================
 useEffect(() => {
  if (!token || !user) return;

  const tryFetch = () => {
    const socket = socketService.getSocket();
    if (!socket) {
      setTimeout(tryFetch, 500); // ⭐ wait until socket ready
      return;
    }

    const fetchConversations = () => {
      setLoading(true);

      chatService.getConversations(page, PAGE_SIZE, (data) => {
        setChats(data || []);
        setLoading(false);
      });
    };

    if (socket.connected) {
      fetchConversations();
    } else {
      socket.once("connect", fetchConversations);
    }
  };

  tryFetch();

}, [token, user, page]);

  // ================= REALTIME LISTENERS =================
  useEffect(() => {
    if (!token || !user) return;

    const handleMessage = (newMessage: any) => {
      setChats((prev) => {
        const updated = prev.map((chat) =>
          chat._id === newMessage.conversation
            ? {
                ...chat,
                lastMessage:
                  newMessage.content || newMessage.messageType,
                updatedAt: new Date().toISOString(),
              }
            : chat
        );

        return updated.sort(
          (a, b) =>
            new Date(b.updatedAt!).getTime() -
            new Date(a.updatedAt!).getTime()
        );
      });
    };

    const handleUnread = ({ conversationId, unreadCount }: any) => {
      setChats((prev) =>
        prev.map((chat) =>
          chat._id === conversationId
            ? { ...chat, unreadCount }
            : chat
        )
      );
    };

    const handleNewConversation = (conversation: any) => {
      setChats((prev) => [conversation, ...prev]);
    };

    socketService.on("message", handleMessage);
    socketService.on("unreadUpdate", handleUnread);
    socketService.on("newConversation", handleNewConversation);

    return () => {
      socketService.off("message", handleMessage);
      socketService.off("unreadUpdate", handleUnread);
      socketService.off("newConversation", handleNewConversation);
    };
  }, [token, user]);

  // ================= FILTER =================
  const filteredChats = useMemo(() => {
    return chats.filter((chat) => {
      const otherUser = chat.participants.find(
        (p) => p._id !== user?._id
      );

      const name = otherUser
        ? `${otherUser.firstName} ${otherUser.lastName}`
        : "";

      return `${name} ${chat.lastMessage || ""}`
        .toLowerCase()
        .includes(search.toLowerCase());
    });
  }, [chats, search, user]);

  const paginatedChats = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredChats.slice(start, start + PAGE_SIZE);
  }, [filteredChats, page]);

  const getOtherUser = (participants: Conversation["participants"]) => {
    return participants.find((p) => p._id !== user?._id);
  };

  const formatTime = (date: string) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffMs = now.getTime() - messageDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hr ago`;
    if (diffDays < 7)
      return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

    return messageDate.toLocaleDateString();
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <div className="relative h-14 flex items-center px-6 bg-gray-900/80 border-b border-white/10">
          <h1 className="absolute left-1/2 -translate-x-1/2 text-lg font-semibold">
            Chats
          </h1>

          <div className="ml-auto flex items-center gap-3 relative">

            <input
              placeholder="Search chats..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-56 px-3 py-2 rounded bg-gray-800 border border-white/10"
            />

           {/* 👇 ROLE BASED SEARCH CONTROLS */}

{/* ================= ADMIN + EMPLOYEE ================= */}
{user?.role === "ADMIN" && (
  /* ADMIN ko sirf employees search karna allowed */
  <div className="relative">
    <input
      placeholder="Search employees..."
      value={userSearch}
      onChange={(e) => handleUserSearch(e.target.value)}
      className="w-64 px-3 py-2 rounded bg-gray-800 border border-white/10"
    />

    {searchResults.length > 0 && (
      <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded border border-white/10 shadow-lg z-50 max-h-60 overflow-y-auto">
        {searchResults.map((user) => (
          <div
            key={user._id}
            onClick={() => {
              chatService.createConversation(user._id, (conversation) => {
                router.push(
                  `/dashboard/conversation-list?chatId=${conversation._id}`
                );
              });
            }}
            className="p-3 hover:bg-white/10 cursor-pointer text-sm"
          >
            {user.firstName} {user.lastName}
          </div>
        ))}
      </div>
    )}
  </div>
)}

{/* ================= EMPLOYEE ================= */}
{user?.role === "EMPLOYEE" &&   (
  <>
    {/* Employee Search */}
    <div className="relative">
      <input
        placeholder="Search employees..."
        value={userSearch}
        onChange={(e) => handleUserSearch(e.target.value)}
        className="w-64 px-3 py-2 rounded bg-gray-800 border border-white/10"
      />

      {searchResults.length > 0 && (
        <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded border border-white/10 shadow-lg z-50 max-h-60 overflow-y-auto">
          {searchResults.map((user) => (
            <div
              key={user._id}
              onClick={() => {
                chatService.createConversation(user._id, (conversation) => {
                  router.push(
                    `/dashboard/conversation-list?chatId=${conversation._id}`
                  );
                });
              }}
              className="p-3 hover:bg-white/10 cursor-pointer text-sm"
            >
              {user.firstName} {user.lastName}
            </div>
          ))}
        </div>
      )}
    </div>

   {/* Client Search (ONLY FOR SALES EMPLOYEE) */}
{user?.role === "EMPLOYEE" && user?.department === "SALES" && (
  <div className="relative">
    <input
      placeholder="Search clients..."
      value={clientSearch}
      onChange={(e) => handleClientSearch(e.target.value)}
      className="w-64 px-3 py-2 rounded bg-gray-800 border border-white/10"
    />

    {clientResults.length > 0 && (
      <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded border border-white/10 shadow-lg z-50 max-h-60 overflow-y-auto">
        {clientResults.map((client) => (
          <div
            key={client._id}
            onClick={() => {
              chatService.createConversation(client._id, (conversation) => {
                router.push(
                  `/dashboard/conversation-list?chatId=${conversation._id}`
                );
              });
            }}
            className="p-3 hover:bg-white/10 cursor-pointer text-sm"
          >
            {client.firstName} {client.lastName}
          </div>
        ))}
      </div>
    )}
  </div>
)}
  </>
)}

          </div>
        </div>

        {/* Conversations Table remains SAME */}
        <main className="flex-1 p-6">
          <div className="bg-gray-900/70 rounded-xl border border-white/10 overflow-hidden">
            {loading ? (
              <div className="p-6 text-center text-gray-400">
                Loading chats...
              </div>
            ) : paginatedChats.length === 0 ? (
              <div className="p-6 text-center text-gray-400">
                No conversations yet
              </div>
            ) : (
              <table className="w-full text-sm">
                <tbody>
                  {paginatedChats.map((chat) => {
                    const otherUser = getOtherUser(chat.participants);

                    return (
                      <tr
                        key={chat._id}
                        onClick={() =>
                          router.push(
                            `/dashboard/conversation-list?chatId=${chat._id}`
                          )
                        }
                        className="border-t border-white/10 hover:bg-white/5 cursor-pointer"
                      >
                        <td className="px-4 py-4 flex items-center gap-3">
                          <img
                            src={
                              otherUser?.profilePicture ||
                              `https://ui-avatars.com/api/?name=${otherUser?.firstName}+${otherUser?.lastName}`
                            }
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="flex flex-col">
                            <span className="font-semibold">
                              {otherUser?.firstName} {otherUser?.lastName}
                            </span>
                            <span className="text-gray-400 text-xs truncate max-w-xs">
                              {chat.lastMessage}
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-4 text-right">
                          <div className="flex flex-col items-end gap-1">
                            <span className="text-xs text-gray-400">
                              {formatTime(
                                chat.updatedAt ||
                                  new Date().toISOString()
                              )}
                            </span>

                            {(chat.unreadCount ?? 0) > 0 && (
                              <span className="bg-[#EE2737] text-xs px-2 py-0.5 rounded-full">
                                {chat.unreadCount}
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}