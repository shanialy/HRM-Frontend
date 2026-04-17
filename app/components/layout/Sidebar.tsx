"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Home,
  Users,
  MessageSquare,
  Settings,
  ClipboardCheck,
  LogOut,
} from "lucide-react";
import { logout } from "@/app/dashboard/redux/slices/authSlice";
import {
  selectChatTotalUnread,
  setConversationUnread,
  setUnreadMapFromConversations,
} from "@/app/dashboard/redux/slices/chatUnreadSlice";
import { useAppDispatch, useAppSelector } from "@/app/dashboard/redux/hooks";
import { chatService, type Conversation } from "@/app/services/chat.service";
import socketService from "@/app/services/socket.service";

/* ================= TYPES ================= */
type Role = "admin" | "employee" | "client" | null;

function ChatSidebarLink({
  href,
  className,
  totalUnread,
}: {
  href: string;
  className: string;
  totalUnread: number;
}) {
  const n = Math.max(0, Math.floor(Number(totalUnread) || 0));
  return (
    <Link href={href} className={className}>
      <MessageSquare className="shrink-0" size={18} aria-hidden />
      <span className="min-w-0 flex-1">Chat</span>
      {n > 0 && (
        <span
          className={`grid flex-none place-items-center rounded-full border-0 text-[12px] font-bold tabular-nums leading-none tracking-tight text-white shadow-none outline-none ring-0 ${
            n > 99
              ? "h-5 max-h-5 min-h-5 min-w-5 px-1.5"
              : n >= 10
                ? "h-5 max-h-5 min-h-5 min-w-5 px-1"
                : "h-5 max-h-5 min-h-5 w-5 min-w-5 max-w-5 overflow-hidden p-0"
          }`}
          aria-label={`${n} unread messages`}
        >
          {n > 99 ? "99+" : n}
        </span>
      )}
    </Link>
  );
}

/* ================= COMPONENT ================= */
export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const token = useAppSelector((s) => s.auth.token);
  const user = useAppSelector((s) => s.auth.user);
  const totalUnread = useAppSelector(selectChatTotalUnread);

  // ✅ Role from localStorage
  const [role] = useState<Role>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("role") as Role;
  });

  // ✅ Department from localStorage
  const [department] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("department");
  });

  useEffect(() => {
    if (!token || !user?._id) return;

    let cancelled = false;
    const userId = user._id;

    const applyConversations = (conversations: Conversation[]) => {
      if (cancelled) return;
      dispatch(setUnreadMapFromConversations({ conversations, userId }));
    };

    const refreshUnread = () => {
      chatService.getConversations(1, 100, (data) => {
        applyConversations(data ?? []);
      });
    };

    refreshUnread();

    const onUnread = (data: {
      conversationId: string;
      unreadCount: number;
    }) => {
      if (cancelled) return;
      dispatch(setConversationUnread(data));
    };

    const onNewConversation = () => {
      if (cancelled) return;
      refreshUnread();
    };

    const onConnected = () => {
      if (cancelled) return;
      socketService.on("unreadUpdate", onUnread);
      socketService.on("newConversation", onNewConversation);
    };

    socketService.onReady(onConnected);

    return () => {
      cancelled = true;
      socketService.off("unreadUpdate", onUnread);
      socketService.off("newConversation", onNewConversation);
    };
  }, [token, user?._id, dispatch]);

  if (!role) return null;

  /* ================= HELPERS ================= */
  const linkClass = (href: string) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg transition
     ${
       pathname === href
         ? "bg-[#EE2737] text-white"
         : "text-gray-300 hover:bg-white/10 hover:text-white"
     }`;

  /* ================= UI ================= */
  return (
    <aside className="flex h-screen min-h-0 w-64 flex-col overflow-hidden bg-gray-900 p-6 text-white">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <h2 className="text-xl font-bold mb-8 capitalize text-[#EE2737]">
          {role} Dashboard
        </h2>

        <nav className="flex flex-col gap-2">
          {/* CLIENT */}
          {role === "client" && (
            <>
              <Link
                href="/dashboard/client-dashboard"
                className={linkClass("/dashboard/client-dashboard")}
              >
                <Home size={18} />
                Home
              </Link>

              <ChatSidebarLink
                href="/dashboard/conversation-list"
                className={linkClass("/dashboard/conversation-list")}
                totalUnread={totalUnread}
              />

              <Link
                href="/dashboard/settings"
                className={linkClass("/dashboard/settings")}
              >
                <Settings size={18} />
                Settings
              </Link>
            </>
          )}

          {/* EMPLOYEE */}
          {role === "employee" && (
            <>
              <Link
                href="/dashboard/employe-dashboard"
                className={linkClass("/dashboard/employe-dashboard")}
              >
                <Home size={18} />
                Home
              </Link>

              {department === "SALES" && (
                <Link
                  href="/dashboard/employe-dashboard/clients"
                  className={linkClass("/dashboard/employe-dashboard/clients")}
                >
                  <Users size={18} />
                  Clients
                </Link>
              )}

              <Link
                href="/dashboard/employe-dashboard/attendence"
                className={linkClass("/dashboard/employe-dashboard/attendence")}
              >
                <ClipboardCheck size={18} />
                Attendance
              </Link>

              <ChatSidebarLink
                href="/dashboard/conversation-list/chat-list"
                className={linkClass("/dashboard/conversation-list/chat-list")}
                totalUnread={totalUnread}
              />
              <Link
                href="/dashboard/my-profile"
                className={linkClass("/dashboard/my-profile")}
              >
                <Users size={18} />
                My Profile
              </Link>

              <Link
                href="/dashboard/settings"
                className={linkClass("/dashboard/settings")}
              >
                <Settings size={18} />
                Settings
              </Link>
            </>
          )}

          {/* ADMIN */}
          {role === "admin" && (
            <>
              <Link
                href="/dashboard/admin-dashboard"
                className={linkClass("/dashboard/admin-dashboard")}
              >
                <Home size={18} />
                Home
              </Link>

              <Link
                href="/dashboard/admin-dashboard/employes-list"
                className={linkClass(
                  "/dashboard/admin-dashboard/employes-list",
                )}
              >
                <Users size={18} />
                Employees
              </Link>

              <Link
                href="/dashboard/admin-dashboard/employees-attendence"
                className={linkClass(
                  "/dashboard/admin-dashboard/employees-attendence",
                )}
              >
                <ClipboardCheck size={18} />
                Attendance
              </Link>

              <Link
                href="/dashboard/admin-dashboard/attendance-requests"
                className={linkClass(
                  "/dashboard/admin-dashboard/attendance-requests",
                )}
              >
                <ClipboardCheck size={18} />
                Attendance Requests
              </Link>

              <Link
                href="/dashboard/admin-dashboard/leaves"
                className={linkClass("/dashboard/admin-dashboard/leaves")}
              >
                <ClipboardCheck size={18} />
                Leave Requests
              </Link>

              <ChatSidebarLink
                href="/dashboard/conversation-list/chat-list"
                className={linkClass("/dashboard/conversation-list/chat-list")}
                totalUnread={totalUnread}
              />

              <Link
                href="/dashboard/settings"
                className={linkClass("/dashboard/settings")}
              >
                <Settings size={18} />
                Settings
              </Link>
            </>
          )}
        </nav>
      </div>

      {/* LOGOUT — keep above scroll bleed; separate from nav for badge alignment */}
      <div className="relative z-10 mt-4 shrink-0 border-t border-white/10 bg-gray-900 pt-4">
        <button
          type="button"
          onClick={() => {
            dispatch(logout());
            localStorage.clear();
            router.push("/auth/login");
          }}
          className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-[#EE2737] px-4 py-3 font-semibold transition hover:bg-[#d81f2e]"
        >
          <LogOut className="shrink-0" size={18} aria-hidden />
          Logout
        </button>
      </div>
    </aside>
  );
}
