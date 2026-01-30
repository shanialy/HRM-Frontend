"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Role = "admin" | "employee" | "client" | null;

export default function Sidebar() {
    const [role, setRole] = useState<Role>(null);
    const router = useRouter();

    useEffect(() => {
        const savedRole = localStorage.getItem("role") as Role;
        setRole(savedRole);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("role");
        router.push("/auth/login");
    };

    if (!role) return null;

    return (
        <aside className="w-64 h-screen overflow-hidden 
                 bg-gray-900 text-white p-6 
                 px-6 pt-6 pb-6
                 flex flex-col">
            {/* TOP */}
            <div>
                <h2 className="text-2xl font-bold mb-8 capitalize">
                    {role} Dashboard
                </h2>

                <nav className="flex flex-col gap-4">
                    {/* CLIENT */}
                    {role === "client" && (
                        <>
                            <Link href="/dashboard/client-dashboard" className="hover:text-blue-400">
                                Client
                            </Link>
                            <Link href="/dashboard/conversation-list"
                                className="hover:text-blue-400 cursor-pointer">
                                Chat View
                            </Link>
                            {/* <Link href="/dashboard/profile" className="hover:text-blue-400">
                                My Profile
                            </Link> */}
                            <Link href="/dashboard/settings" className="hover:text-blue-400">
                                Settings
                            </Link>
                        </>
                    )}

                    {/* EMPLOYEE */}
                    {role === "employee" && (
                        <>
                            <Link href="/dashboard/employe-dashboard" className="hover:text-blue-400">
                                Employee
                            </Link>
                            <Link href="/dashboard/employe-dashboard/clients" className="hover:text-blue-400">
                                Client
                            </Link>
                            <Link href="/dashboard/employe-dashboard/attendence" className="hover:text-blue-400">
                                Attendence
                            </Link>
                            <Link href="/dashboard/settings" className="hover:text-blue-400">
                                Settings
                            </Link>
                        </>
                    )}

                    {/* ADMIN */}
                    {role === "admin" && (
                        <>
                            <Link href="/dashboard/admin-dashboard" className="hover:text-blue-400">
                                Admin
                            </Link>

                            <Link
                                href="/dashboard/admin-dashboard/employes-list"
                                onClick={() => {
                                    console.log("Employee link tapped");
                                }}
                                className="hover:text-blue-400 cursor-pointer"
                            >
                                View Employees
                            </Link>
                            <Link
                                href="/dashboard/admin-dashboard/employees-attendence"
                                className="hover:text-blue-400 cursor-pointer"
                            >
                                Employees Attendance
                            </Link>
                            <Link href="/dashboard/settings" className="hover:text-blue-400">
                                Settings
                            </Link>
                        </>
                    )}
                </nav>
            </div>

            {/* LOGOUT */}
            <div className="mt-auto p-6">
                <button
                    onClick={() => {
                        localStorage.clear();
                        router.push("/auth/login");
                    }}
                    className="w-full px-4 py-3
        bg-blue-600 hover:bg--700
        rounded-xl font-semibold
        shadow-lg transition"
                >
                    Logout
                </button>
            </div>
        </aside>
    );
}
