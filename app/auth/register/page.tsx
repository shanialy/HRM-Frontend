import Link from "next/link";
import Navbar from "../../components/layout/Navbar";

export default function RegisterPage() {
    return (
        <main
            className="min-h-screen flex items-center justify-center"
            style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1950&q=80')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50"></div>

            <div className="relative w-full max-w-sm bg-white p-6 rounded-xl shadow-lg z-10">
                <h2 className="text-2xl font-bold text-center mb-6">
                    Register
                </h2>

                <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold">
                    Register
                </button>

                <p className="text-center text-sm mt-4">
                    Already have an account?{" "}
                    <Link href="/login" className="text-blue-600 font-semibold">
                        Login
                    </Link>
                </p>

                <p className="text-center text-sm mt-2">
                    After registration → <Link href="/auth/create-profile" className="text-blue-600 font-semibold">Create Profile</Link>
                </p>
            </div>
        </main>
    );
}
