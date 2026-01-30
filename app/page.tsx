import Link from "next/link";
import Navbar from "./components/layout/Navbar";
import Button from "./components/ui/Button";

export default function SplashPage() {
  return (
    <main
      className="min-h-screen flex items-center justify-center text-white bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"

    >
      <div className="mt-16">
        {/* Glass Container */}
        <div className="w-[410px] min-h-[400px]
           flex flex-col justify-center
           text-center px-8 py-14 rounded-2xl
           bg-gray-900/80
           backdrop-blur-xl
           shadow-2xl
           border border-gray-700/50">
          <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">
            TSH HRM
          </h1>

          <p className="mb-8 text-lg opacity-90 drop-shadow-md">
            Welcome to Our Company’s Official Web Portal
          </p>

          <Button href="/auth/login" className="w-full text-center">
            Go to Login
          </Button>
        </div>
      </div>
    </main>
  );
}
