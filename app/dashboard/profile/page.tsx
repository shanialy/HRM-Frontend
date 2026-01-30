"use client";

import Sidebar from "@/app/components/layout/Sidebar";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const router = useRouter();

    const profile = {
        name: "John Doe",
        email: "john.doe@example.com",
        role: "Client",
        image: "https://randomuser.me/api/portraits/men/32.jpg",
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">

            {/* SIDEBAR */}
            <Sidebar />

            {/* MAIN AREA */}
            <div className="flex-1 flex flex-col">
                {/* APP BAR */}
                <header className="relative h-14 flex items-center px-6 bg-gray-900/80 backdrop-blur-md border-b border-white/10 shadow-md">
                    {/* LEFT SPACER */}
                    <div className="w-20" />

                    {/* CENTER TITLE */}
                    <h1 className="absolute left-1/2 -translate-x-1/2 text-lg font-semibold tracking-wide">
                        Profile
                    </h1>

                    {/* RIGHT SPACER */}
                    <div className="w-20" />
                </header>

                {/* PROFILE CONTENT */}
                <main className="flex-1 flex justify-center items-start p-6">
                    <div className="w-full max-w-md bg-gray-900/70 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl p-8 flex flex-col items-center">

                        {/* Profile Image */}
                        <img
                            src={profile.image}
                            alt={profile.name}
                            className="w-28 h-28 rounded-full object-cover border-4 border-white mb-4"
                        />

                        {/* Name */}
                        <h1 className="text-3xl font-bold mb-2">{profile.name}</h1>

                        {/* Email */}
                        <p className="text-gray-300 mb-2">{profile.email}</p>

                        {/* Role */}
                        <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm">
                            {profile.role}
                        </span>

                    </div>
                </main>
            </div>
        </div>
    );
}
