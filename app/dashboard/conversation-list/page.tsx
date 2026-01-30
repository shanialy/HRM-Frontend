"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

type Message = {
    id: number;
    text: string;
    type: "text" | "image" | "video" | "pdf";
    sender: "user" | "client";
    fileUrl?: string;
};

type Client = {
    id: number;
    name: string;
    image: string;
};

export default function DashboardChatPage() {
    const router = useRouter();

    const clients: Client[] = [
        { id: 1, name: "John Doe", image: "https://randomuser.me/api/portraits/men/32.jpg" },
        { id: 2, name: "Jane Smith", image: "https://randomuser.me/api/portraits/women/44.jpg" },
        { id: 3, name: "Emily Johnson", image: "https://randomuser.me/api/portraits/women/68.jpg" },
    ];

    const [selectedClient, setSelectedClient] = useState<Client | null>(clients[0]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [showMediaSheet, setShowMediaSheet] = useState(false);

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const chatEndRef = useRef<HTMLDivElement | null>(null);

    const sendMessage = (msg: Message) => {
        setMessages((prev) => [...prev, msg]);
        setInput("");
        setShowMediaSheet(false);
        setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    };

    const handleSendText = () => {
        if (!input.trim()) return;
        sendMessage({
            id: Date.now(),
            text: input,
            type: "text",
            sender: "user",
        });
    };

    const handleMediaPick = (type: "image" | "video" | "pdf") => {
        if (fileInputRef.current) {
            fileInputRef.current.accept =
                type === "image" ? "image/*" : type === "video" ? "video/*" : ".pdf";
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "video" | "pdf") => {
        const file = e.target.files?.[0];
        if (!file) return;
        const fileUrl = URL.createObjectURL(file);
        sendMessage({
            id: Date.now(),
            text: file.name,
            type,
            sender: "user",
            fileUrl,
        });
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">

            {/* SIDEBAR */}
            <aside className="w-64 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 border-r border-white/10 flex flex-col p-4">
                <h1 className="text-2xl font-bold mb-4">Clients</h1>
                <div className="flex-1 overflow-y-auto space-y-2">
                    {clients.map((c) => (
                        <button
                            key={c.id}
                            className={`flex items-center gap-3 w-full p-2 rounded-lg transition 
                ${selectedClient?.id === c.id ? "bg-blue-700" : "hover:bg-blue-800"}`}
                            onClick={() => setSelectedClient(c)}
                        >
                            <img src={c.image} alt={c.name} className="w-10 h-10 rounded-full object-cover" />
                            <span className="font-semibold">{c.name}</span>
                        </button>
                    ))}
                </div>
            </aside>

            {/* CHAT AREA */}
            <div className="flex-1 flex flex-col">
                {/* APP BAR */}
                <header className="h-14 flex items-center px-6 bg-gray-900/80 backdrop-blur-md border-b border-white/10 shadow-md">
                    <button
                        onClick={() => router.back()}
                        className="px-3 py-1 rounded hover:bg-white/20 transition"
                    >
                        ← Back
                    </button>
                    <h1 className="flex-1 text-center font-bold text-lg">{selectedClient?.name || "Select Client"}</h1>
                    <div className="w-20" />
                </header>

                {/* MESSAGES */}
                <main className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800/80 rounded-tl-2xl">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`max-w-[70%] p-3 rounded-2xl backdrop-blur-md break-words
                ${msg.sender === "user" ? "self-end bg-blue-600 text-white" : "self-start bg-gray-800 text-white"}`}
                        >
                            {msg.type === "text" && <p>{msg.text}</p>}
                            {msg.type === "image" && msg.fileUrl && (
                                <img src={msg.fileUrl} alt={msg.text} className="rounded-md max-h-60 mt-1" />
                            )}
                            {msg.type === "video" && msg.fileUrl && (
                                <video src={msg.fileUrl} controls className="rounded-md max-h-60 mt-1" />
                            )}
                            {msg.type === "pdf" && msg.fileUrl && (
                                <a href={msg.fileUrl} target="_blank" className="underline text-blue-300 mt-1 block">
                                    {msg.text}
                                </a>
                            )}
                        </div>
                    ))}
                    <div ref={chatEndRef} />
                </main>

                {/* INPUT AREA */}
                <div className="p-4 bg-gray-900/80 backdrop-blur-md flex items-center gap-2 border-t border-white/10 relative">
                    <button
                        onClick={() => setShowMediaSheet(!showMediaSheet)}
                        className="text-xl hover:text-blue-400 transition"
                    >
                        📎
                    </button>
                    <input
                        type="text"
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 rounded-full bg-gray-800 placeholder-gray-400 outline-none text-white"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendText()}
                    />
                    <button
                        onClick={handleSendText}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-full transition"
                    >
                        Send
                    </button>

                    {/* MEDIA PICKER SHEET */}
                    {showMediaSheet && (
                        <div className="absolute bottom-12 left-3 bg-gray-800/80 backdrop-blur-md rounded-lg p-2 flex flex-col gap-2 shadow-lg z-10">
                            <button className="px-3 py-1 rounded hover:bg-gray-700" onClick={() => handleMediaPick("image")}>
                                Image
                            </button>
                            <button className="px-3 py-1 rounded hover:bg-gray-700" onClick={() => handleMediaPick("video")}>
                                Video
                            </button>
                            <button className="px-3 py-1 rounded hover:bg-gray-700" onClick={() => handleMediaPick("pdf")}>
                                PDF
                            </button>
                        </div>
                    )}
                </div>

                {/* HIDDEN FILE INPUT */}
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={(e) => {
                        const type =
                            fileInputRef.current?.accept.startsWith("image")
                                ? "image"
                                : fileInputRef.current?.accept.startsWith("video")
                                    ? "video"
                                    : "pdf";
                        handleFileChange(e, type as "image" | "video" | "pdf");
                    }}
                />
            </div>
        </div>
    );
}
