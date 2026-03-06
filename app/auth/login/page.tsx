






"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import Button from "@/app/components/ui/Button";
import { loginUser } from "@/app/services/auth.services";
import { normalizeRole } from "@/app/utills/normalizeRole";
import { setCredentials } from "@/app/dashboard/redux/slices/authSlice";

import { useDispatch } from "react-redux";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      // alert("Email & password required");
      return;
    }

    try {
      setLoading(true);
      const response = await loginUser({ email, password });

      // ✅ EXACT ACCESS
      const { token, user }:any = response.data.data;

      // role normalize (ADMIN → admin)
      const role = normalizeRole(user.role);

      // redux
      dispatch(setCredentials({ token, user }));

      // localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      localStorage.setItem("role", role);
   // 🔥 Decode token to get department
const decoded = JSON.parse(atob(token.split(".")[1]));
localStorage.setItem("department", decoded.department);

      // redirect
      if (role === "admin") {
        router.push("/dashboard/admin-dashboard");
      } else if (role === "employee") {
        router.push("/dashboard/employe-dashboard");
      } else if (role === "client") {
        router.push("/dashboard/client-dashboard");
      }

    } catch (error: any) {
      // console.error(error);
     
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center text-white bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="w-[410px] min-h-[400px] flex flex-col justify-center text-center px-8 py-14 rounded-2xl bg-gray-900/80 backdrop-blur-xl shadow-2xl border border-gray-700/50">
        <h2 className="text-3xl font-bold mb-6">Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded-lg bg-white text-gray-900"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded-lg bg-white text-gray-900"
        />

        <Button
          onClick={handleLogin}
          // disabled={loading}
          className="w-full py-2 rounded-lg font-semibold"
        >
          {loading ? "Logging in..." : "Login"}
        </Button>

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

