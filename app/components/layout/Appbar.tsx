"use client";

import { useRouter } from "next/navigation";

export default function AppBar() {
    const router = useRouter();

    return (
        <div className="w-full h-14 bg-white shadow flex items-center px-4 relative">

            {/* Back Button */}
            <button
                onClick={() => router.back()}
                className="text-gray-700 font-medium hover:text-blue-600"
            >
                ← Back
            </button>

            {/* Center Title */}
            <h1 className="absolute left-1/2 transform -translate-x-1/2 text-lg font-semibold">
                All Employees
            </h1>
        </div>
    );
}
