"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function useAuth(requiredRole?: string) {
  // 👈 type add
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      router.replace("/auth/login");
      return;
    }

    if (requiredRole && role !== requiredRole) {
      router.replace("/");
      return;
    }

    setAuthorized(true);
  }, []);

  return authorized;
}
