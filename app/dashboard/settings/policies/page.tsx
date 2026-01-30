"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Sidebar from "@/app/components/layout/Sidebar";

export default function PoliciesPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const type = searchParams.get("type");

    const titleMap: any = {
        terms: "Terms & Conditions",
        privacy: "Privacy Policy",
        about: "About Us",
    };

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            <Sidebar />

            <div className="flex-1 flex flex-col">
                {/* APP BAR */}
                <div className="relative h-14 flex items-center px-6
                        bg-gray-900/80 backdrop-blur-md
                        border-b border-white/10 shadow-md">

                    <h1 className="absolute left-1/2 -translate-x-1/2
                         text-lg font-semibold tracking-wide">
                        Settings
                    </h1>
                    {/* <button
                        onClick={() => router.back()}
                        className="text-sm text-gray-300
           px-3 py-1.5
           border border-white/10
           rounded-lg
           hover:text-white hover:bg-white/10
           transition"
                    >
                        ← Back
                    </button> */}

                    {/* <h1 className="absolute left-1/2 -translate-x-1/2
                         text-lg font-semibold tracking-wide">
                        {titleMap[type] || "Policy"} */}
                    {/* </h1> */}
                </div>

                {/* CONTENT */}
                <main className="flex-1 flex justify-center p-6">
                    <div className="w-full max-w-3xl
                          bg-gray-900/70 backdrop-blur-lg
                          border border-white/10
                          rounded-2xl shadow-2xl
                          p-8 space-y-6 text-gray-300 leading-relaxed">

                        {/* TERMS */}
                        {type === "terms" && (
                            <>
                                <h2 className="text-xl font-semibold text-white">
                                    Terms & Conditions
                                </h2>

                                <p>
                                    By accessing and using this platform, you agree to comply
                                    with and be bound by the following terms and conditions.
                                </p>

                                <h3 className="text-lg font-semibold text-white">
                                    User Responsibilities
                                </h3>
                                <p>
                                    Users are responsible for maintaining the confidentiality
                                    of their account and all activities performed under it.
                                </p>

                                <h3 className="text-lg font-semibold text-white">
                                    Restrictions
                                </h3>
                                <p>
                                    You may not misuse the system, attempt unauthorized access,
                                    or violate any applicable laws.
                                </p>
                            </>
                        )}

                        {/* PRIVACY */}
                        {type === "privacy" && (
                            <>
                                <h2 className="text-xl font-semibold text-white">
                                    Privacy Policy
                                </h2>

                                <p>
                                    We respect your privacy and are committed to protecting
                                    your personal data.
                                </p>

                                <h3 className="text-lg font-semibold text-white">
                                    Information We Collect
                                </h3>
                                <p>
                                    We may collect personal details such as name, email,
                                    and usage data to improve our services.
                                </p>

                                <h3 className="text-lg font-semibold text-white">
                                    Data Protection
                                </h3>
                                <p>
                                    Your data is securely stored and never shared without consent
                                    unless required by law.
                                </p>
                            </>
                        )}

                        {/* ABOUT */}
                        {type === "about" && (
                            <>
                                <h2 className="text-xl font-semibold text-white">
                                    About Us
                                </h2>

                                <p>
                                    We are a modern admin platform designed to help organizations
                                    manage employees efficiently and securely.
                                </p>

                                <p>
                                    Our goal is to provide a clean, fast, and reliable experience
                                    with enterprise-level UI standards.
                                </p>

                                <p>
                                    Built with ❤️ using modern web technologies.
                                </p>
                            </>
                        )}

                    </div>
                </main>
            </div>
        </div >
    );
}
