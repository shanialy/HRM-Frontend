"use client";

import { useEffect } from "react";
import { useAppSelector } from "@/app/dashboard/redux/hooks";
import socketService from "@/app/services/socket.service";

export default function GlobalSocketSound() {
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    if (!user) return;

    const handleMessage = (message: any) => {
      if (message.sender?._id !== user._id) {
        const audio = new Audio("/faaah.mp3");
        audio.play().catch(() => {});
      }
    };

    socketService.on("message", handleMessage);
    return () => socketService.off("message", handleMessage);
  }, [user]);

  return null;
}
