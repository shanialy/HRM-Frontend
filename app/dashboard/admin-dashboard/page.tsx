"use client";

import Sidebar from "@/app/components/layout/Sidebar";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* SIDEBAR */}
      <Sidebar />

      {/* RIGHT SECTION */}
      <div className="flex flex-col flex-1">
        {/* App Bar */}
        <div
          className="h-14 flex items-center px-6
      bg-gray-900/80 backdrop-blur-md
      border-b border-white/10 shadow-md"
        >
          {/* LEFT SPACER */}
          <div className="w-20" />

          {/* CENTER TITLE */}
          <h1 className="flex-1 text-center text-lg font-semibold tracking-wide">
            Admin Dashboard
          </h1>

          {/* RIGHT PROFILE IMAGE */}
          <div className="w-20 flex justify-end">
            <img
              src="https://ui-avatars.com/api/?name=Admin+Userhttps://ui-avatars.com/api/?name=Admin+Dashboard&background=EE2737&color=fffhttps://ui-avatars.com/api/?name=Admin+Dashboard&background=f5f5f5&color=000"
              alt="Profile"
              onClick={() => router.push("/dashboard/my-profile")}
              className="w-11 h-11 rounded-full object-cover
                     cursor-pointer border border-white/20
                     hover:scale-105 transition"
            />
          </div>
        </div>
        {/* MAIN CONTENT */}
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Employees */}
            <div
              onClick={() =>
                router.push("/dashboard/admin-dashboard/employes-list")
              }
              className="bg-gray-800/80 backdrop-blur-md
        border border-white/10 p-8 rounded-xl shadow-lg
        flex items-center justify-center text-xl font-semibold
        cursor-pointer hover:bg-gray-700/80 transition"
            >
              Employees
            </div>

            {/* Apps Projects */}
            <div
              onClick={() => router.push("/dashboard/projects")}
              className="bg-gray-800/80 backdrop-blur-md
        border border-white/10 p-8 rounded-xl shadow-lg
        flex items-center justify-center text-xl font-semibold
        cursor-pointer hover:bg-gray-700/80 transition"
            >
              Mobile Applications Projects
            </div>

            {/* Web Projects */}
            <div
              onClick={() => router.push("/dashboard/projects")}
              className="bg-gray-800/80 backdrop-blur-md
        border border-white/10 p-8 rounded-xl shadow-lg
        flex items-center justify-center text-xl font-semibold
        cursor-pointer hover:bg-gray-700/80 transition"
            >
              Web Projects
            </div>
            {/* Clients */}
            <div
              onClick={() => router.push("/dashboard/admin-dashboard/clients")}
              className="bg-gray-800/80 backdrop-blur-md
        border border-white/10 p-8 rounded-xl shadow-lg
        flex items-center justify-center text-xl font-semibold
        cursor-pointer hover:bg-gray-700/80 transition"
            >
              Clients
            </div>

            {/* Attendance */}
            <div
              onClick={() =>
                router.push("/dashboard/admin-dashboard/employees-attendence")
              }
              className="bg-gray-800/80 backdrop-blur-md
        border border-white/10 p-8 rounded-xl shadow-lg
        flex items-center justify-center text-xl font-semibold
        cursor-pointer hover:bg-gray-700/80 transition"
            >
              Attendance
            </div>

            {/* Payroll */}
            <div
              onClick={() => router.push("/dashboard/payroll")}
              className="bg-gray-800/80 backdrop-blur-md
        border border-white/10 p-8 rounded-xl shadow-lg
        flex items-center justify-center text-xl font-semibold
        cursor-pointer hover:bg-gray-700/80 transition"
            >
              Payroll
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
