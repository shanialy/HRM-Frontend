"use client";

import Sidebar from "@/app/components/layout/Sidebar";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useRouter } from "next/navigation";

/* ================= TYPES ================= */
type Message = {
  id: number;
  text: string;
  sender: "me" | "other";
  time: string;
};

export default function ConversationPage() {
  const searchParams = useSearchParams();
  const chatId = searchParams.get("chatId");

  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hi 👋", sender: "other", time: "10:01 AM" },
    { id: 2, text: "Hello! How can I help?", sender: "me", time: "10:02 AM" },
    {
      id: 3,
      text: "Need update on the task",
      sender: "other",
      time: "10:03 AM",
    },
  ]);

  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: input,
        sender: "me",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);

    setInput("");
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* LEFT SIDEBAR */}
      <Sidebar />

      {/* RIGHT CONVERSATION VIEW */}
      <div className="flex-1 flex flex-col">
        {/* HEADER */}

        <div className="h-14 px-6 flex items-center justify-between border-b border-white/10 bg-gray-900/80">
          {/* LEFT: Back + User */}
          <div className="flex items-center gap-4">
            {/* Back Button */}
            <button
              onClick={() => router.back()}
              className="text-gray-400 hover:text-white transition"
            >
              ← Back
            </button>

            {/* Avatar + Name */}
            <div className="flex items-center gap-3">
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                className="w-9 h-9 rounded-full object-cover border border-white/20"
              />
              <div className="leading-tight">
                <p className="font-semibold text-sm">John Smith</p>
                <p className="text-xs text-gray-400">Active now</p>
              </div>
            </div>
          </div>

          {/* RIGHT (optional future actions) */}
          <div className="flex items-center gap-4 text-gray-400">
            {/* placeholders */}
            {/* <button>🔍</button> */}
            {/* <button>⋮</button> */}
          </div>
        </div>
        {/* MESSAGES */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`max-w-[70%] px-4 py-2 rounded-lg text-sm ${
                msg.sender === "me" ? "ml-auto bg-[#EE2737]" : "bg-gray-800"
              }`}
            >
              <p>{msg.text}</p>
              <span className="text-[10px] text-gray-300 block text-right mt-1">
                {msg.time}
              </span>
            </div>
          ))}
        </div>
        {/* INPUT */}
        <div className="p-4 border-t border-white/10 bg-gray-900/80 flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 rounded bg-gray-800 border border-white/10"
          />
          <button
            onClick={sendMessage}
            className="bg-[#EE2737] px-5 py-2 rounded"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
