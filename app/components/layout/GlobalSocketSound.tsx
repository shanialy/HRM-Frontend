"use client";

import { useEffect } from "react";
import { useAppSelector } from "@/app/dashboard/redux/hooks";
import socketService from "@/app/services/socket.service";

export default function GlobalSocketSound() {
  const user = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);

  useEffect(() => {
    if (!token || !user?._id) return;

    let cancelled = false;

    const handleMessage = (message: { sender?: { _id?: string } }) => {
      console.log("GlobalSocketSound=======:", message, cancelled);
      if (cancelled) return;
      console.log("Current user ID:", message?.sender?._id !== user._id);
      if (message?.sender?._id !== user._id) {
        new Audio("/faaah.mp3").play().catch(() => {});
      }
    };

    const onConnected = () => {
      if (cancelled) return;
      socketService.on("message", handleMessage);
    };

    socketService.onReady(onConnected);

    return () => {
      cancelled = true;
      socketService.off("message", handleMessage);
    };
  }, [token, user?._id]);

  return null;
}
