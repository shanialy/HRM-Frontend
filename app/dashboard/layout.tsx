"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import useAuth from "../utills/useAuth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const authorized = useAuth(); // 👈 login check
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");

    // 👇 sirf dashboards block karo (shared pages allow)
    if (role === "employee" && pathname.includes("admin-dashboard")) {
      router.replace("/dashboard/employe-dashboard");
      return;
    }

    if (role === "employee" && pathname.includes("client-dashboard")) {
      router.replace("/dashboard/employe-dashboard");
      return;
    }

    if (role === "admin" && pathname.includes("employe-dashboard")) {
      router.replace("/dashboard/admin-dashboard");
      return;
    }

    if (role === "admin" && pathname.includes("client-dashboard")) {
      router.replace("/dashboard/admin-dashboard");
      return;
    }

    if (role === "client" && pathname.includes("admin-dashboard")) {
      router.replace("/dashboard/client-dashboard");
      return;
    }

    if (role === "client" && pathname.includes("employe-dashboard")) {
      router.replace("/dashboard/client-dashboard");
      return;
    }

    setChecked(true); // ✅ allow UI
  }, [pathname]);

  if (!authorized || !checked) return null;

  return <>{children}</>;
}
