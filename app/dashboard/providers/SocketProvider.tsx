"use client";

import { useEffect } from "react";
import { useAppSelector } from "../redux/hooks";
import socketService from "@/app/services/socket.service";

export default function SocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = useAppSelector((state) => state.auth.token);

  useEffect(() => {
    console.log("🔎 SocketProvider mounted");
    console.log("🔎 Token:", token);

    if (!token) {
      console.log("⛔ No token yet");
      socketService.disconnect(); // 🔥 ensure clean state
      return;
    }

    console.log("🚀 Connecting socket...");
    socketService.disconnect(); // 🔥 prevent duplicate sockets
    socketService.connect(token);

    return () => {
      console.log("🛑 Cleaning up socket");
      socketService.disconnect();
    };
  }, [token]);

  return <>{children}</>;
}