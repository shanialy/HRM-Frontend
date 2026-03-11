"use client";

import socketService from "@/app/services/socket.service";
import dynamic from "next/dynamic";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { chatService, Conversation } from "@/app/services/chat.service";
import { useAppSelector } from "@/app/dashboard/redux/hooks";

const Sidebar = dynamic(() => import("@/app/components/layout/Sidebar"), {
  ssr: false,
});

const PAGE_SIZE = 6;

export default function ChatListPage() {
  console.log("🚀 ChatListPage render");

  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);

  console.log("👤 User:", user);
  console.log("🔑 Token:", token);

  const [chats, setChats] = useState<Conversation[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [userSearch, setUserSearch] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const [clientSearch, setClientSearch] = useState("");
  const [clientResults, setClientResults] = useState<any[]>([]);

  console.log("📊 State:", { chats, search, page, loading });

  // ================= EMPLOYEE SEARCH =================
  const handleUserSearch = (value: string) => {
    console.log("🔍 Employee search input:", value);

    setUserSearch(value);

    if (!value.trim()) {
      console.log("⚠️ Empty employee search");
      setSearchResults([]);
      return;
    }

    chatService.searchUsers(value, (users: any[]) => {
      console.log("📥 searchUsers response:", users);

      const employeesOnly = users.filter((u) => u.role !== "CLIENT");

      console.log("👨‍💼 Employees filtered:", employeesOnly);

      setSearchResults(employeesOnly);
    });
  };

  // ================= CLIENT SEARCH =================
  const handleClientSearch = (value: string) => {
    console.log("🔍 Client search input:", value);

    setClientSearch(value);

    if (!value.trim()) {
      console.log("⚠️ Empty client search");
      setClientResults([]);
      return;
    }

    chatService.searchUsers(value, (users: any[]) => {
      console.log("📥 client search response:", users);

      const clientsOnly = users.filter((u) => u.role === "CLIENT");

      console.log("👥 Clients filtered:", clientsOnly);

      setClientResults(clientsOnly);
    });
  };

  // ================= FETCH WHEN SOCKET READY =================
  useEffect(() => {
    console.log("🟢 REALTIME LISTENERS useEffect");

    if (!token || !user) {
      console.log("❌ Token or user missing");
      return;
    }

    const tryFetch = () => {
      console.log("🔄 tryFetch running");

      const socket = socketService.getSocket();

      console.log("🔌 Socket in listeners:", socket);
      console.log("🔌 Socket connected:", socket?.connected);

      if (!socket) {
        console.log("⏳ Socket not ready, retrying...");
        setTimeout(tryFetch, 500);
        return;
      }

      const fetchConversations = () => {
        console.log("📥 Fetching conversations");

        setLoading(true);

        chatService.getConversations(page, PAGE_SIZE, (data) => {
          console.log("📦 Conversations received:", data);

          setChats(data || []);
          setLoading(false);
        });
      };

      if (socket.connected) {
        console.log("✅ SOCKET CONNECT EVENT FIRED");

        fetchConversations();
      } else {
        console.log("⌛ Waiting socket connect");

        socket.once("connect", () => {
          console.log("⚡ SOCKET CONNECTED EVENT");
          fetchConversations();
        });
      }
    };

    tryFetch();
  }, [token, user, page]);

  // ================= REALTIME LISTENERS =================
  useEffect(() => {
    console.log("🟢 REALTIME LISTENERS useEffect");

    if (!token || !user) {
      console.log("❌ Token or user missing for listeners");
      return;
    }

    const handleMessage = (newMessage: any) => {
      console.log("💬 MESSAGE EVENT:", newMessage);

      setChats((prev) => {
        const exists = prev.find(
          (chat) => chat._id === newMessage.conversation,
        );
        console.log("chat exists:", exists);

        if (!exists) {
          console.log("⚠️ Conversation not found in chat list");
          return prev;
        }

        const updated = prev.map((chat) =>
          chat._id === newMessage.conversation
            ? {
                ...chat,
                lastMessage:
                  newMessage.content ||
                  (newMessage.messageType === "IMAGE"
                    ? "📷 Photo"
                    : newMessage.messageType === "VIDEO"
                      ? "🎥 Video"
                      : newMessage.messageType === "AUDIO"
                        ? "🎵 Audio"
                        : newMessage.messageType === "FILE"
                          ? "📄 File"
                          : ""),

                updatedAt: newMessage.createdAt || new Date().toISOString(),
              }
            : chat,
        );

        console.log("📊 Chats after message update:", updated);

        return updated.sort(
          (a, b) =>
            new Date(b.updatedAt!).getTime() - new Date(a.updatedAt!).getTime(),
        );
      });
    };

    const handleUnread = ({ conversationId, unreadCount }: any) => {
      console.log("🔥 UNREAD EVENT RECEIVED");
      console.log("conversationId:", conversationId);
      console.log("unreadCount:", unreadCount);
      setChats((prev) => {
        const updated = prev.map((chat) =>
          chat._id === conversationId
            ? {
                ...chat,
                unreadCount,
                unreadCounts: {
                  ...(chat.unreadCounts || {}),
                  [user?._id as string]: unreadCount,
                },
              }
            : chat,
        );

        return updated;
      });
    };

    const handleNewConversation = (conversation: any) => {
      console.log("🆕 NEW CONVERSATION:", conversation);

      setChats((prev) => [conversation, ...prev]);
    };

    console.log("👂 Attaching message listener");
    const socket = socketService.getSocket();
    socketService.on("message", handleMessage);

    console.log("👂 Attaching unreadUpdate listener");
    socketService.on("unreadUpdate", handleUnread);

    console.log("👂 Attaching newConversation listener");
    socketService.on("newConversation", handleNewConversation);

    return () => {
      console.log("🧹 Cleaning listeners");

      socketService.off("message", handleMessage);
      socketService.off("unreadUpdate", handleUnread);
      socketService.off("newConversation", handleNewConversation);
    };
  }, [token, user]);

  // ================= FILTER =================
  const filteredChats = useMemo(() => {
    console.log("🔍 Filtering chats");

    return chats.filter((chat) => {
      const otherUser = chat.participants.find((p) => p._id !== user?._id);

      const name = otherUser
        ? `${otherUser.firstName} ${otherUser.lastName}`
        : "";

      return `${name} ${chat.lastMessage || ""}`
        .toLowerCase()
        .includes(search.toLowerCase());
    });
  }, [chats, search, user]);

  const paginatedChats = useMemo(() => {
    console.log("📄 Paginating chats page:", page);

    const start = (page - 1) * PAGE_SIZE;
    return filteredChats.slice(start, start + PAGE_SIZE);
  }, [filteredChats, page]);

  const getOtherUser = (participants: Conversation["participants"]) => {
    console.log("👤 Finding other user");

    return participants.find((p) => p._id !== user?._id);
  };

  const formatTime = (date: string) => {
    console.log("⏱ Formatting time:", date);

    const now = new Date();
    const messageDate = new Date(date);
    const diffMs = now.getTime() - messageDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hr ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

    return messageDate.toLocaleDateString();
  };

  console.log("🎨 Rendering UI");

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
                console.log("🔎 Chat search:", e.target.value);
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-56 px-3 py-2 rounded bg-gray-800 border border-white/10"
            />

            {/* UI PART SAME AS YOUR FILE — NO LOGIC CHANGE */}
          </div>
        </div>

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
                    const unread =
                      chat.unreadCount ??
                      chat.unreadCounts?.[user?._id as string] ??
                      0;

                    console.log("📬 unread for chat:", chat._id, unread);

                    const otherUser = getOtherUser(chat.participants);

                    return (
                      <tr
                        key={chat._id}
                        onClick={() =>
                          router.push(
                            `/dashboard/conversation-list?chatId=${chat._id}`,
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
                              {chat.lastMessage === "IMAGE"
                                ? "📷 Photo"
                                : chat.lastMessage === "VIDEO"
                                  ? "🎥 Video"
                                  : chat.lastMessage === "AUDIO"
                                    ? "🎵 Audio"
                                    : chat.lastMessage === "FILE"
                                      ? "📄 File"
                                      : chat.lastMessage}
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-4 text-right">
                          <div className="flex flex-col items-end gap-1">
                            <span className="text-xs text-gray-400">
                              {formatTime(
                                chat.updatedAt || new Date().toISOString(),
                              )}
                            </span>
                            {unread > 0 && (
                              <span className="bg-[#EE2737] text-xs px-2 py-0.5 rounded-full">
                                {unread}
                              </span>
                            )}{" "}
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
