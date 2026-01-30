import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="w-full bg-white bg-opacity-90 backdrop-blur-md shadow-md py-3 px-6 flex justify-between items-center">
            <h1 className="text-xl font-bold text-blue-600">Company Name</h1>

            {/* <div className="flex gap-4">
                <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">
                    Home
                </Link>
                <Link href="/login" className="text-gray-700 hover:text-blue-600 font-medium">
                    Login
                </Link>
                <Link href="/register" className="text-gray-700 hover:text-blue-600 font-medium">
                    Register
                </Link>
                <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">
                    Dashboard
                </Link>
            </div> */}
        </nav>
    );
}
