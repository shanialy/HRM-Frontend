"use client";

import Sidebar from "@/app/components/layout/Sidebar";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef, Suspense } from "react";
import {
  chatService,
  Message,
  Conversation,
} from "@/app/services/chat.service";
import { useAppSelector } from "@/app/dashboard/redux/hooks";
import socketService from "@/app/services/socket.service";

function ConversationContent() {
  const searchParams = useSearchParams();
  const chatId = searchParams.get("chatId");
  const router = useRouter();

  const user = useAppSelector((state) => state.auth.user);
  console.log("Logged user:", user);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [loading, setLoading] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ================= FETCH DATA =================
  useEffect(() => {
    console.log("useEffect triggered", { chatId, user });

    if (!chatId) {
      console.log("No chatId found, redirecting...");
      router.push("/dashboard/conversation-list/chat-list");
      return;
    }

    if (!user) {
      console.log("User not loaded yet");
      return;
    }

    const socket = socketService.getSocket?.();
    console.log("Socket instance:", socket);

    console.log("Socket already connected");

    setLoading(true);

    const handleSocketConnect = () => {
      console.log("Socket reconnected");

      chatService.getMessages(chatId, 1, 200, (data) => {
        console.log("Messages fetched after reconnect:", data);

        setMessages(
          (data || []).sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
          ),
        );
        setLoading(false);
      });
    };

    socket?.on("connect", handleSocketConnect);

    console.log("Fetching messages initially");

    chatService.getMessages(chatId, 1, 200, (data) => {
      console.log("Initial messages:", data);

      setMessages(
        (data || []).sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        ),
      );
      setLoading(false);
    });

    console.log("Fetching conversations");

    chatService.getConversations(1, 100, (conversations) => {
      console.log("Conversations received:", conversations);

      const currentConv = conversations.find((c) => c._id === chatId);

      if (currentConv) {
        console.log("Current conversation:", currentConv);
        setConversation(currentConv);
      }
    });

    console.log("Marking conversation as read:", chatId);
    chatService.markAsRead(chatId);

    const handleNewMessage = (message: Message) => {
      console.log("🔥 SOCKET MESSAGE RECEIVED:", message);
      console.log("TESTING MESSAGE", message?.sender._id, user?._id);
      // if (message.sender._id !== user?._id) {
      //   const audio = new Audio("/faaah.mp3");
      //   audio.play().catch((err) => {
      //     console.log("Audio play blocked:", err);
      //   });
      // }
      if (message.conversation?.toString() === chatId?.toString()) {
        console.log("Message belongs to this chat");

        setMessages((prev) => {
          console.log("Previous messages:", prev);

          const exists = prev.some((m) => m._id === message._id);
          console.log("Message already exists:", exists);

          if (exists) return prev;

          const updated = [...prev, message];
          console.log("Updated messages:", updated);

          return updated;
        });

        chatService.markAsRead(chatId);
      }
    };

    console.log("Removing old message listener");

    console.log("Adding new message listener");
    chatService.onMessage(handleNewMessage);

    if (!socket?.connected) {
      console.log("Socket not connected yet");

      socket?.once("connect", () => {
        console.log("Socket connected (once)");

        chatService.getMessages(chatId, 1, 200, (data) => {
          console.log("Messages fetched (once connect):", data);

          setMessages(
            (data || []).sort(
              (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime(),
            ),
          );
          setLoading(false);
        });
      });
      return;
    }

    chatService.onError((error) => {
      console.error("Chat error:", error.message);
    });

    return () => {
      console.log("Cleanup listeners");

      chatService.removeListener("message", handleNewMessage);
      chatService.removeListener("error");
      socket?.off("connect", handleSocketConnect);
    };
  }, [chatId, user, router]);

  // ================= AUTO SCROLL =================
  useEffect(() => {
    console.log("Messages updated → auto scroll", messages.length);

    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    console.log("sendMessage triggered", { input, selectedFile });

    if (!chatId) {
      console.log("No chatId, cannot send");
      return;
    }

    // TEXT ONLY
    if (input.trim() && !selectedFile) {
      console.log("Sending TEXT message:", input);

      chatService.sendMessage({
        conversationId: chatId,
        messageType: "TEXT",
        content: input.trim(),
      });

      setInput("");
      return;
    }

    // MEDIA MESSAGE
    if (selectedFile) {
      console.log("Uploading file:", selectedFile);

      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        const res = await fetch(
          "https://d15mne01ku2os0.cloudfront.net/api/v1/media/upload",
          {
            method: "POST",
            body: formData,
          },
        );

        const data = await res.json();

        console.log("Uploaded file:", data);

        const fileUrl = data.data.url;
        const mimeType = data.data.mimeType;

        console.log("File URL:", fileUrl);
        console.log("MimeType:", mimeType);

        let messageType: "IMAGE" | "VIDEO" | "AUDIO" | "FILE" = "FILE";

        if (mimeType.startsWith("image")) messageType = "IMAGE";
        else if (mimeType.startsWith("video")) messageType = "VIDEO";
        else if (mimeType.startsWith("audio")) messageType = "AUDIO";

        console.log("Sending message:", { chatId, messageType, fileUrl });

        chatService.sendMessage({
          conversationId: chatId,
          messageType,
          mediaUrl: fileUrl,
          content: input || "",
        });

        setSelectedFile(null);
        setInput("");
      } catch (error) {
        console.error("Upload failed:", error);
      }
    }
  };

  const getOtherUser = () => {
    if (!conversation) return null;

    console.log("Finding other participant");

    return conversation.participants.find((p) => p._id !== user?._id);
  };

  const otherUser = getOtherUser();

  const formatTime = (date: string) => {
    const formatted = new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return formatted;
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <Sidebar />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* HEADER */}
        <div className="h-14 px-6 flex items-center justify-between border-b border-white/10 bg-gray-900/80 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() =>
                router.push("/dashboard/conversation-list/chat-list")
              }
              className="text-gray-400 hover:text-white transition"
            >
              ← Back
            </button>

            {otherUser && (
              <div className="flex items-center gap-3">
                <img
                  src={
                    otherUser.profilePicture ||
                    `https://ui-avatars.com/api/?name=${otherUser.firstName}+${otherUser.lastName}`
                  }
                  className="w-9 h-9 rounded-full object-cover border border-white/20"
                  alt={`${otherUser.firstName} ${otherUser.lastName}`}
                />
                <div className="leading-tight">
                  <p className="font-semibold text-sm">
                    {otherUser.firstName} {otherUser.lastName}
                  </p>
                  <p className="text-xs text-gray-400">{otherUser.role}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {loading ? (
            <div className="text-center text-gray-400">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-400">
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.sender._id === user?._id;

              return (
                <div
                  key={msg._id}
                  className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] text-sm ${
                      msg.messageType === "TEXT"
                        ? `px-4 py-2 rounded-lg ${
                            isMe ? "bg-[#EE2737]" : "bg-gray-900"
                          }`
                        : ""
                    }`}
                  >
                    {!isMe && (
                      <p className="text-xs text-gray-300 mb-1">
                        {msg.sender.firstName} {msg.sender.lastName}
                      </p>
                    )}
                    {msg.messageType === "TEXT" && <p>{msg.content}</p>}
                    {msg.messageType === "IMAGE" && (
                      <div className="flex flex-col gap-1">
                        <img
                          src={msg.mediaUrl}
                          className="max-w-[320px] rounded-lg object-cover"
                        />
                        {msg.content && (
                          <p className="text-sm">{msg.content}</p>
                        )}
                      </div>
                    )}
                    {msg.messageType === "VIDEO" && (
                      <div className="flex flex-col gap-1">
                        <video
                          src={msg.mediaUrl}
                          controls
                          className="max-w-[400px] rounded-lg"
                        />
                        {msg.content && (
                          <p className="text-sm">{msg.content}</p>
                        )}
                      </div>
                    )}
                    {msg.messageType === "AUDIO" && (
                      <div className="flex flex-col gap-1">
                        <audio
                          src={msg.mediaUrl}
                          controls
                          className="w-[260px]"
                        />
                        {msg.content && (
                          <p className="text-sm">{msg.content}</p>
                        )}
                      </div>
                    )}
                    {msg.messageType === "FILE" && (
                      <div className="flex items-center justify-between gap-3 bg-gray-800 px-4 py-3 rounded-lg max-w-[350px] hover:bg-gray-700 transition">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="w-10 h-10 flex items-center justify-center rounded bg-[#EE2737] text-white font-bold text-xs">
                            {msg.mediaUrl?.split(".").pop()?.toUpperCase()}
                          </div>

                          <div className="flex flex-col overflow-hidden">
                            <span className="text-sm truncate">
                              {msg.mediaUrl?.split("/").pop()}
                            </span>

                            <span className="text-xs text-gray-400">
                              {msg.mediaUrl?.split(".").pop()?.toUpperCase()}{" "}
                              File
                            </span>
                          </div>
                        </div>

                        <a
                          href={msg.mediaUrl}
                          download
                          target="_blank"
                          className="text-sm bg-[#EE2737] px-3 py-1 rounded hover:bg-red-600"
                        >
                          Download
                        </a>
                      </div>
                    )}{" "}
                    <span className="text-[15px] text-gray-300 block text-right mt-1">
                      {formatTime(msg.createdAt)}
                    </span>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {selectedFile && (
          <div className="px-4 pb-2">
            <div className="w-32 h-32 rounded-lg overflow-hidden border border-white/10 bg-gray-800 relative flex items-center justify-center">
              {selectedFile.type.startsWith("image") && (
                <img
                  src={URL.createObjectURL(selectedFile)}
                  className="w-full h-full object-cover"
                />
              )}

              {selectedFile.type.startsWith("video") && (
                <video
                  src={URL.createObjectURL(selectedFile)}
                  className="w-full h-full object-cover"
                />
              )}

              {selectedFile.type.startsWith("audio") && (
                <audio
                  src={URL.createObjectURL(selectedFile)}
                  controls
                  className="w-full"
                />
              )}

              {selectedFile.type === "application/pdf" && (
                <embed
                  src={URL.createObjectURL(selectedFile)}
                  className="w-full h-full"
                />
              )}

              {!selectedFile.type.startsWith("image") &&
                !selectedFile.type.startsWith("video") &&
                !selectedFile.type.startsWith("audio") &&
                selectedFile.type !== "application/pdf" && (
                  <div className="text-xs text-gray-300 text-center px-2">
                    {selectedFile.name}
                  </div>
                )}

              <button
                onClick={() => {
                  console.log("Removing selected file");
                  setSelectedFile(null);
                }}
                className="absolute top-1 right-1 bg-black/60 text-white text-xs px-1 rounded"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* INPUT */}
        <div className="p-4 border-t border-white/10 bg-gray-900/80 flex gap-3 items-center relative">
          <input
            type="file"
            ref={fileInputRef}
            hidden
            onChange={(e) => {
              console.log("File selected:", e.target.files);

              if (e.target.files && e.target.files[0]) {
                setSelectedFile(e.target.files[0]);
              }
            }}
          />

          {/* ATTACH BUTTON */}
          <div className="relative">
            <button
              onClick={() => {
                console.log("Toggle attach menu");

                setShowAttachMenu(!showAttachMenu);
              }}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-800 border border-white/10 hover:bg-gray-700 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.44 11.05l-9.19 9.19a5.5 5.5 0 01-7.78-7.78l9.9-9.9a3.5 3.5 0 114.95 4.95l-9.19 9.19a1.5 1.5 0 11-2.12-2.12l8.49-8.48"
                />
              </svg>
            </button>

            {showAttachMenu && (
              <div className="absolute bottom-12 left-0 w-44 bg-gray-900 border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden">
                <button
                  onClick={() => {
                    console.log("Attach image clicked");
                    fileInputRef.current?.click();
                    setShowAttachMenu(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800 w-full text-left"
                >
                  <span className="text-lg">📷</span>
                  <span className="text-sm">Image</span>
                </button>

                <button
                  onClick={() => {
                    console.log("Attach video clicked");
                    fileInputRef.current?.click();
                    setShowAttachMenu(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800 w-full text-left"
                >
                  <span className="text-lg">🎥</span>
                  <span className="text-sm">Video</span>
                </button>

                <button
                  onClick={() => {
                    console.log("Attach audio clicked");
                    fileInputRef.current?.click();
                    setShowAttachMenu(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800 w-full text-left"
                >
                  <span className="text-lg">🎵</span>
                  <span className="text-sm">Audio</span>
                </button>

                <button
                  onClick={() => {
                    console.log("Attach file clicked");
                    fileInputRef.current?.click();
                    setShowAttachMenu(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800 w-full text-left"
                >
                  <span className="text-lg">📄</span>
                  <span className="text-sm">File</span>
                </button>
              </div>
            )}
          </div>

          <input
            value={input}
            onChange={(e) => {
              console.log("Input changed:", e.target.value);
              setInput(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                console.log("Enter pressed → sending message");
                sendMessage();
              }
            }}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 rounded bg-gray-800 border border-white/10"
          />

          <button
            onClick={() => {
              console.log("Send button clicked");
              sendMessage();
            }}
            className="bg-[#EE2737] px-5 py-2 rounded"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ConversationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConversationContent />
    </Suspense>
  );
}
