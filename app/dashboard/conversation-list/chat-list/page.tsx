"use client";

import Sidebar from "@/app/components/layout/Sidebar";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { chatService, Conversation } from "@/app/services/chat.service";
import { useAppSelector } from "@/app/dashboard/redux/hooks";

const PAGE_SIZE = 6;

export default function ChatListPage() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);

  const [chats, setChats] = useState<Conversation[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = () => {
      chatService.getConversations(page, PAGE_SIZE, (data) => {
        setChats(data);
        setLoading(false);
      });
    };

    fetchConversations();

    // =====================================================
    // 🔥 REAL-TIME MESSAGE HANDLER (FIXED)
    // =====================================================
    const handleNewMessage = (message: any) => {
      setChats((prevChats) => {
        const exists = prevChats.find(
          (chat) => chat._id === message.conversation
        );

        // 🔥 If conversation not in state → insert it manually
        if (!exists) {
          return [
            {
              _id: message.conversation,
              participants: message.sender._id === user?._id
                ? []
                : [message.sender],
              lastMessage: message.content || message.messageType,
              messageType: message.messageType,
              updatedAt: message.createdAt,
              unreadCount:
                message.sender._id !== user?._id ? 1 : 0,
            } as any,
            ...prevChats,
          ];
        }

        // 🔥 Update existing conversation
        const updated = prevChats.map((chat) => {
          if (chat._id === message.conversation) {
            return {
              ...chat,
              lastMessage: message.content || message.messageType,
              updatedAt: message.createdAt,
              unreadCount:
                message.sender._id !== user?._id
                  ? (chat.unreadCount || 0) + 1
                  : chat.unreadCount,
            };
          }
          return chat;
        });

        // 🔥 Move updated chat to top
        const updatedChat = updated.find(
          (c) => c._id === message.conversation
        );

        return [
          updatedChat!,
          ...updated.filter((c) => c._id !== message.conversation),
        ];
      });
    };

    chatService.onMessage(handleNewMessage);

    // =====================================================
    // 🔥 HANDLE NEW CONVERSATION (ALWAYS FETCH)
    // =====================================================
    const handleNewConversation = () => {
      fetchConversations();
    };

    chatService.onNewConversation(handleNewConversation);

    // =====================================================
    // 🔥 HANDLE UNREAD UPDATE (PROPER REORDER)
    // =====================================================
    const handleUnreadUpdate = ({
      conversationId,
      unreadCount,
    }: {
      conversationId: string;
      unreadCount: number;
    }) => {
      setChats((prev) => {
        const exists = prev.find((c) => c._id === conversationId);

        // 🔥 If conversation missing → fetch full list
        if (!exists) {
          fetchConversations();
          return prev;
        }

        const updated = prev.map((chat) =>
          chat._id === conversationId
            ? { ...chat, unreadCount }
            : chat
        );

        const updatedChat = updated.find(
          (c) => c._id === conversationId
        );

        return [
          updatedChat!,
          ...updated.filter((c) => c._id !== conversationId),
        ];
      });
    };

    chatService.onUnreadUpdate(handleUnreadUpdate);

    chatService.onError((error) => {
      console.error("Chat error:", error.message);
    });

    return () => {
      chatService.removeListener("conversations");
      chatService.removeListener("newConversation", handleNewConversation);
      chatService.removeListener("message", handleNewMessage);
      chatService.removeListener("unreadUpdate", handleUnreadUpdate);
      chatService.removeListener("error");
    };
  }, [page, user]);

  const filteredChats = useMemo(() => {
    return chats.filter((chat) => {
      const otherUser = chat.participants.find(
        (p) => p._id !== user?._id
      );
      const name = otherUser
        ? `${otherUser.firstName} ${otherUser.lastName}`
        : "";
      return `${name} ${chat.lastMessage}`
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