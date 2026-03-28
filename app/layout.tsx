import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReduxProvider from "./dashboard/providers/ReduxProvider";
import SocketProvider from "./dashboard/providers/SocketProvider";
import { Toaster } from "react-hot-toast";
import GlobalSocketSound from "@/app/components/layout/GlobalSocketSound"; // client component

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ✅ This is server-side, no "use client"
export const metadata: Metadata = {
  title: "TSH-HRM",
  description: "TSH-HRM",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
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
