"use client";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReduxProvider from "./dashboard/providers/ReduxProvider";
import SocketProvider from "./dashboard/providers/SocketProvider";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useAppSelector } from "./dashboard/redux/hooks";
import socketService from "@/app/services/socket.service";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TSH-HRM",
  description: "TSH-HRM",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
            }}
          />

          <SocketProvider>
            <GlobalSocketSound />
            {children}
          </SocketProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}

// ================= GLOBAL SOCKET SOUND =================
function GlobalSocketSound() {
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

    return () => {
      socketService.off("message", handleMessage);
    };
  }, [user]);

  return null;
}
