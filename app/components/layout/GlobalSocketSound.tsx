"use client";

import { useEffect } from "react";
import { useAppSelector } from "@/app/dashboard/redux/hooks";
import socketService from "@/app/services/socket.service";

export default function GlobalSocketSound() {
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    if (!user) return;

    const socket = socketService.getSocket();

    const attachListener = () => {
      console.log(
        "GlobalSocketSound attaching listener, socket connected:",
        socket?.connected,
      );

      const handleMessage = (message: any) => {
        console.log("GlobalSocketSound received message:", message);
        if (message.sender?._id !== user._id) {
          const audio = new Audio("/faaah.mp3");
          audio.play().catch(() => {});
        }
      };

      socketService.on("message", handleMessage);

      return () => {
        console.log("GlobalSocketSound cleaning listener");
        socketService.off("message", handleMessage);
      };
    };

    if (!socket || !socket.connected) {
      console.log("GlobalSocketSound waiting for socket connect...");
      socket?.once("connect", () => {
        console.log("GlobalSocketSound socket connected");
        attachListener();
      });
    } else {
      return attachListener();
    }
  }, [user]);

  return null;
}
