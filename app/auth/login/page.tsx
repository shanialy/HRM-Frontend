"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import Button from "@/app/components/ui/Button";
import { loginUser } from "@/app/services/auth.services";
import { normalizeRole } from "@/app/utills/normalizeRole";
import { setCredentials } from "@/app/dashboard/redux/slices/authSlice";
import socketService from "@/app/services/socket.service";
import { useDispatch } from "react-redux";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  // ✅ CHANGE 1: password show/hide ke liye state add ki
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      return;
    }

    try {
      setLoading(true);
      const response = await loginUser({ email, password });

      const { token, user }: any = response.data.data;

      const role = normalizeRole(user.role);

      dispatch(setCredentials({ token, user }));
      socketService.connect(token);

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", role);

      const decoded = JSON.parse(atob(token.split(".")[1]));
      localStorage.setItem("department", decoded.department);

      if (role === "admin") {
        router.push("/dashboard/admin-dashboard");
      } else if (role === "employee") {
        router.push("/dashboard/employe-dashboard");
      } else if (role === "client") {
        router.push("/dashboard/client-dashboard");
      }
    } catch (error: any) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center text-white bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="w-[410px] min-h-[400px] flex flex-col justify-center text-center px-8 py-14 rounded-2xl bg-gray-900/80 backdrop-blur-xl shadow-2xl border border-gray-700/50">
        <h2 className="text-3xl font-bold mb-6">Login</h2>

        {/* EMAIL INPUT */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded-lg bg-white text-gray-900"
        />

        {/* ================= PASSWORD SECTION ================= */}

        {/* ✅ CHANGE 2: relative div banaya taake eye icon input ke andar aaye */}
        <div className="relative mb-4">
          {/* ✅ CHANGE 3: input type dynamic kiya */}
          <input
            type={showPassword ? "text" : "password"} // 👈 toggle logic
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-white text-gray-900 pr-10"
          />

          {/* ✅ CHANGE 4: eye toggle button add */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
          >
            {showPassword ? "🙈" : "👁"}
          </button>
        </div>

        {/* LOGIN BUTTON */}
        <Button
          onClick={handleLogin}
          className="w-full py-2 rounded-lg font-semibold"
        >
          {loading ? "Logging in..." : "Login"}
        </Button>

        {/* FORGOT PASSWORD */}
        <div className="mt-4 flex justify-end">
          <Link
            href="/auth/forgot-password"
            className="text-gray-300 font-semibold hover:underline text-sm"
          >
            Forgot Password?
          </Link>
        </div>
      </div>
    </main>
  );
}
