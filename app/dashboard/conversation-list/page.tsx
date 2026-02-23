"use client";

import Sidebar from "@/app/components/layout/Sidebar";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { chatService, Message, Conversation } from "@/app/services/chat.service";
import { useAppSelector } from "@/app/dashboard/redux/hooks";

export default function ConversationPage() {
  const searchParams = useSearchParams();
  const chatId = searchParams.get("chatId");
  const router = useRouter();

  const user = useAppSelector((state) => state.auth.user);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch conversation details and messages
  useEffect(() => {
    if (!chatId) {
      router.push("/dashboard/conversation-list/chat-list");
      return;
    }

    // Fetch messages
    chatService.getMessages(chatId, 1, 50, (data) => {
      setMessages(data.reverse()); // Reverse to show oldest first
      setLoading(false);
    });

    // Fetch conversation details
    chatService.getConversations(1, 100, (conversations) => {
      const currentConv = conversations.find((c) => c._id === chatId);
      if (currentConv) {
        setConversation(currentConv);
      }
    });

    // Mark as read
    chatService.markAsRead(chatId);

    // Listen for new messages
    const handleNewMessage = (message: Message) => {
      if (message.conversation === chatId) {
        setMessages((prev) => [...prev, message]);
        chatService.markAsRead(chatId);
      }
    };

    chatService.onMessage(handleNewMessage);

    return () => {
      chatService.removeListener("message", handleNewMessage);
      chatService.removeListener("getMessages");
    };
  }, [chatId, router]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || !chatId) return;

    chatService.sendMessage({
      conversationId: chatId,
      messageType: "TEXT",
      content: input.trim(),
    });

    setInput("");
  };

  const getOtherUser = () => {
    if (!conversation) return null;
    return conversation.participants.find((p) => p._id !== user?._id);
  };

  const otherUser = getOtherUser();

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <div className="h-14 px-6 flex items-center justify-between border-b border-white/10 bg-gray-900/80">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/dashboard/conversation-list/chat-list")}
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
                  className={`max-w-[70%] px-4 py-2 rounded-lg text-sm ${isMe ? "ml-auto bg-[#EE2737]" : "bg-gray-800"
                    }`}
                >
                  {!isMe && (
                    <p className="text-xs text-gray-300 mb-1">
                      {msg.sender.firstName} {msg.sender.lastName}
                    </p>
                  )}
                  <p>{msg.content}</p>
                  <span className="text-[10px] text-gray-300 block text-right mt-1">
                    {formatTime(msg.createdAt)}
                  </span>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
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
