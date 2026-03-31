"use client";

import { useEffect } from "react";
import { useAppSelector } from "@/app/dashboard/redux/hooks";
import socketService from "@/app/services/socket.service";

export default function GlobalSocketSound() {
  const user = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);

  useEffect(() => {
    const unlockAudio = () => {
      console.log("🔓 Audio unlocked silently");

      const audio = new Audio("/faaah.mp3");
      audio.muted = true;

      audio.play().then(() => {
        audio.pause();
        audio.currentTime = 0;
      });

      window.removeEventListener("click", unlockAudio);
    };

    window.addEventListener("click", unlockAudio);

    return () => {
      window.removeEventListener("click", unlockAudio);
    };
  }, []);

  useEffect(() => {
    console.log("🟢 GlobalSocketSound mounted");

    if (!token || !user?._id) {
      console.log("❌ Missing token/user");
      return;
    }

    const handleMessage = (message: { sender?: { _id?: string } }) => {
      console.log("🔥 EVENT RECEIVED:", message);

      if (message?.sender?._id !== user._id) {
        console.log("🔊 PLAY SOUND");
        new Audio("/faaah.mp3").play().catch(() => {
          console.log("❌ AUDIO FAILED");
        });
      }
    };

    const attachListener = () => {
      console.log("⚡ SOCKET READY → attaching listener");

      socketService.off("message", handleMessage);
      socketService.on("message", handleMessage);
    };

    socketService.onReady(() => {
      console.log("✅ SOCKET CONNECTED");
      attachListener();
    });

    return () => {
      console.log("🧹 CLEANUP");
      socketService.off("message", handleMessage);
    };
  }, [token, user?._id]);

  return null;
}
