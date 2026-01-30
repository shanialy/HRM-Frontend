"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import Sidebar from "../../../../components/layout/Sidebar";

type Client = {
    id: number;
    name: string;
    email: string;
};

export default function EmployeeDetailPage() {
    const router = useRouter();
    const params = useSearchParams();

    // 🔹 GET DATA FROM URL
    const firstName = params.get("firstName") || "Unknown";
    const lastName = params.get("lastName") || "";
    const phone = params.get("phone") || "Not provided";
    const address = params.get("address") || "Not provided";
    const department = params.get("department") || "Not provided";
    const designation = params.get("designation") || "Not provided";
    const salary = params.get("salary") || "0";

    const fullName = `${firstName} ${lastName}`.trim();

    const email = `${firstName}.${lastName}`.toLowerCase() + "@company.com";

    // 🔹 SALES CONDITION (designation OR department)
    const isSales =
        /sales/i.test(designation) || /sales/i.test(department);

    const [search, setSearch] = useState("");

    // 🔹 CLIENTS (ONLY FOR SALES)
    const clients: Client[] = [
        { id: 1, name: "Acme Corp", email: "acme@gmail.com" },
        { id: 2, name: "Globex", email: "globex@gmail.com" },
        { id: 3, name: "Initech", email: "initech@gmail.com" },
    ];

    const filteredClients = useMemo(() => {
        return clients.filter(
            (c) =>
                c.name.toLowerCase().includes(search.toLowerCase()) ||
                c.email.toLowerCase().includes(search.toLowerCase())
        );
    }, [search]);

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            <Sidebar />

            <div className="flex-1 flex flex-col">
                {/* HEADER */}
                <header className="relative h-14 flex items-center px-6 bg-gray-900/80 border-b border-white/10">
                    <h1 className="absolute left-1/2 -translate-x-1/2 text-lg font-semibold">
                        Employee Profile
                    </h1>
                </header>

                {isSales ? (
                    /* ================= SALES LAYOUT ================= */
                    <main className="flex-1 p-6 flex gap-6">
                        {/* PROFILE CARD */}
                        <div className="w-full max-w-sm bg-gray-900/70 border border-white/10 rounded-xl p-6">
                            <div className="flex flex-col items-center text-center">
                                <img
                                    src="https://randomuser.me/api/portraits/men/32.jpg"
                                    alt={fullName}
                                    className="w-28 h-28 rounded-full border-4 border-white mb-4"
                                />

                                <h2 className="text-xl font-semibold">{fullName}</h2>
                                <p className="text-gray-300">{email}</p>

                                <span className="mt-2 bg-green-600 px-4 py-1 rounded-full text-sm">
                                    {designation}
                                </span>
                            </div>

                            <div className="mt-6 space-y-2 text-sm text-gray-300">
                                <p><span className="text-gray-400">📞 Phone:</span> {phone}</p>
                                <p><span className="text-gray-400">📍 Address:</span> {address}</p>
                                <p><span className="text-gray-400">🏢 Department:</span> {department}</p>
                                <p><span className="text-gray-400">💰 Salary:</span> ${salary}</p>
                            </div>
                        </div>

                        {/* CLIENTS SECTION */}
                        <div className="flex-1 bg-gray-900/70 border border-white/10 rounded-xl p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold">Clients</h2>
                                <input
                                    placeholder="Search clients..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="px-3 py-2 rounded bg-gray-800 border border-white/10"
                                />
                            </div>

                            <div className="space-y-3">
                                {filteredClients.map((client) => (
                                    <div
                                        key={client.id}
                                        onClick={() =>
                                            router.push("/dashboard/conversation-list")
                                        }
                                        className="p-4 rounded-lg bg-gray-800/70 border border-white/10 hover:bg-gray-700 cursor-pointer"
                                    >
                                        <p className="font-medium">{client.name}</p>
                                        <p className="text-sm text-gray-400">
                                            {client.email}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </main>
                ) : (
                    /* ================= NON-SALES LAYOUT ================= */
                    <main className="flex-1 flex justify-center items-center p-6">
                        <div className="w-full max-w-md bg-gray-900/70 border border-white/10 rounded-xl p-8">
                            <div className="flex flex-col items-center text-center">
                                <img
                                    src="https://randomuser.me/api/portraits/men/32.jpg"
                                    alt={fullName}
                                    className="w-28 h-28 rounded-full border-4 border-white mb-4"
                                />

                                <h1 className="text-2xl font-bold">{fullName}</h1>
                                <p className="text-gray-300">{email}</p>

                                <span className="mt-2 bg-blue-600 px-4 py-1 rounded-full text-sm">
                                    {designation}
                                </span>
                            </div>

                            <div className="mt-6 space-y-2 text-sm text-gray-300">
                                <p><span className="text-gray-400">📞 Phone:</span> {phone}</p>
                                <p><span className="text-gray-400">📍 Address:</span> {address}</p>
                                <p><span className="text-gray-400">🏢 Department:</span> {department}</p>
                                <p><span className="text-gray-400">💰 Salary:</span> ${salary}</p>
                            </div>
                        </div>
                    </main>
                )}
            </div>
        </div>
    );
}
