"use client";

import Sidebar from "@/app/components/layout/Sidebar";
import { useRouter } from "next/navigation";

export default function EmployeesDashboard() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* SIDEBAR */}
      <Sidebar />

      {/* RIGHT SIDE */}
      <div className="flex-1 flex flex-col">
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
            Employee
          </h1>

          {/* RIGHT PROFILE IMAGE */}
          <div className="w-20 flex justify-end">
            <img
              src="/profile.jpg"
              alt="Profile"
              onClick={() => router.push("/dashboard/my-profile")}
              className="w-9 h-9 rounded-full object-cover
                     cursor-pointer border border-white/20
                     hover:scale-105 transition"
            />
          </div>
        </div>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-6 overflow-auto">
          {/* PAGE HEADING */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-300 mt-1">
              Welcome! Here’s your employee overview.
            </p>
          </div>

          {/* DASHBOARD CONTENT */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              className="bg-gray-900/70 backdrop-blur-md
                            border border-white/10
                            rounded-2xl p-6 shadow-2xl"
            >
              <h2 className="text-xl font-semibold mb-2">Tasks</h2>

              <p className="text-gray-300 text-sm">
                View and manage your assigned tasks.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
