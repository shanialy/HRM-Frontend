"use client";

import Sidebar from "@/app/components/layout/Sidebar";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">

            {/* SIDEBAR */}
            <Sidebar />

            <div className="flex-1 flex flex-col">
                {/* APP BAR */}
                <div className="relative h-14 flex items-center px-6
                        bg-gray-900/80 backdrop-blur-md
                        border-b border-white/10 shadow-md">


                    {/* CENTER TITLE */}
                    <h1 className="absolute left-1/2 -translate-x-1/2 text-lg font-semibold tracking-wide">
                        Dashboard
                    </h1>


                </div>

                {/* MAIN CONTENT */}
                <main className="flex-1 p-6 overflow-auto">
                    {/* Page Heading */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold">Dashboard</h1>
                        <p className="text-gray-300 mt-1">
                            Welcome back! Here’s a quick overview of your system.
                        </p>
                    </div>

                    {/* DASHBOARD CARDS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">


                        <div
                            onClick={() => router.push("/dashboard/settings")}
                            className="bg-gray-900/70 backdrop-blur-md border border-white/10
                         rounded-2xl p-6 flex flex-col items-center justify-center
                         cursor-pointer hover:bg-gray-900/80 transition shadow-2xl"
                        >
                            <h2 className="text-xl font-semibold mb-2">Settings</h2>
                            <p className="text-gray-300 text-sm text-center">
                                Manage system settings and policies.
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
