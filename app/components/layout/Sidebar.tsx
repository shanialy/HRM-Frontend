"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import {
  Home,
  Users,
  MessageSquare,
  Settings,
  ClipboardCheck,
  LogOut,
} from "lucide-react";

/* ================= TYPES ================= */
type Role = "admin" | "employee" | "client" | null;

/* ================= COMPONENT ================= */
export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  // ✅ Lazy initialization (NO useEffect → NO warning)
  const [role] = useState<Role>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("role") as Role;
  });

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
    <aside className="w-64 h-screen bg-gray-900 text-white p-6 flex flex-col">
      {/* TOP */}
      <div>
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

              <Link
                href="/dashboard/conversation-list"
                className={linkClass("/dashboard/conversation-list")}
              >
                <MessageSquare size={18} />
                Chat
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

              <Link
                href="/dashboard/employe-dashboard/clients"
                className={linkClass("/dashboard/employe-dashboard/clients")}
              >
                <Users size={18} />
                Clients
              </Link>

              <Link
                href="/dashboard/employe-dashboard/attendence"
                className={linkClass("/dashboard/employe-dashboard/attendence")}
              >
                <ClipboardCheck size={18} />
                Attendance
              </Link>

              <Link
                href="/dashboard/employe-dashboard/client-and-employees-list"
                className={linkClass(
                  "/dashboard/employe-dashboard/client-and-employees-list",
                )}
              >
                <MessageSquare size={18} />
                Chat
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
                href="/dashboard/conversation-list/chat-list"
                className={linkClass("/dashboard/conversation-list/chat-list")}
              >
                <MessageSquare size={18} />
                Chat
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
        </nav>
      </div>

      {/* LOGOUT */}
      <div className="mt-auto">
        <button
          onClick={() => {
            localStorage.clear();
            router.push("/auth/login");
          }}
          className="w-full flex items-center justify-center gap-3
                     px-4 py-3 bg-[#EE2737] hover:bg-[#d81f2e]
                     rounded-xl font-semibold transition cursor-pointer"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
