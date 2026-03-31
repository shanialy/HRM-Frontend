"use client";

import { useEffect, useRef } from "react";
import { useAppSelector } from "@/app/dashboard/redux/hooks";
import socketService from "@/app/services/socket.service";

export default function GlobalSocketSound() {
  const user = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const unlockedRef = useRef(false);

  // ✅ 1. Prepare audio
  useEffect(() => {
    console.log("🎵 Preparing audio");

    audioRef.current = new Audio("/faaah.mp3");
    audioRef.current.preload = "auto";

    const alreadyUnlocked = sessionStorage.getItem("audioUnlocked");
    if (alreadyUnlocked === "true") {
      unlockedRef.current = true;
      console.log("🔓 Audio already unlocked (session)");
    }
  }, []);

  // ✅ 2. Unlock audio once per session (FIXED 🔥)
  useEffect(() => {
    const unlockAudio = () => {
      if (unlockedRef.current || !audioRef.current) return;

      console.log("🔓 Unlocking audio...");

      // ❌ muted hata diya
      // audioRef.current.muted = true;

      // ✅ proper unlock
      audioRef.current.volume = 0;

      audioRef.current
        .play()
        .then(() => {
          audioRef.current?.pause();
          if (audioRef.current) audioRef.current.currentTime = 0;

          if (audioRef.current) {
            audioRef.current.volume = 1;
          }

          unlockedRef.current = true;
          sessionStorage.setItem("audioUnlocked", "true");

          console.log("✅ Audio unlocked properly");
        })
        .catch(() => {
          console.log("❌ Unlock failed");
        });

      window.removeEventListener("click", unlockAudio);
    };

    window.addEventListener("click", unlockAudio);

    return () => {
      window.removeEventListener("click", unlockAudio);
    };
  }, []);

  // ✅ 3. SOCKET LISTENER (FIXED — no miss)
  useEffect(() => {
    console.log("🟢 GlobalSocketSound mounted");

    if (!token || !user?._id) {
      console.log("❌ Missing token/user");
      return;
    }

    const handleMessage = (message: { sender?: { _id?: string } }) => {
      console.log("🔥 EVENT RECEIVED:", message);

      if (message?.sender?._id === user._id) return;

      if (!audioRef.current) return;

      console.log("🔊 PLAY SOUND");

      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {
        console.log("❌ AUDIO BLOCKED");
      });
    };

    let interval: any;

    const attachWhenReady = () => {
      const socket = socketService.getSocket();

      if (socket && socket.connected) {
        console.log("✅ SOCKET READY → attaching listener");

        socket.off("message", handleMessage);
        socket.on("message", handleMessage);

        clearInterval(interval);
      } else {
        console.log("⏳ Waiting for socket...");
      }
    };

    // 🔥 keep checking until socket ready
    interval = setInterval(attachWhenReady, 300);

    return () => {
      console.log("🧹 CLEANUP");

      clearInterval(interval);

      const socket = socketService.getSocket();
      socket?.off("message", handleMessage);
    };
  }, [token, user?._id]);

  return null;
}
