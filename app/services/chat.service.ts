import socketService from "./socket.service";

export interface Conversation {
  _id: string;
  participants: Array<{
    _id: string;
    firstName: string;
    lastName: string;
    role: string;
    profilePicture?: string;
  }>;
  lastMessage: string;
  messageType: string;
  updatedAt?: string;
  unreadCount?: number;
  unreadCounts?: Record<string, number>;
}

export interface Message {
  _id: string;
  conversation: string;
  sender: {
    _id: string;
    firstName: string;
    lastName: string;
    role: string;
    profilePicture?: string;
  };
  messageType: "TEXT" | "IMAGE" | "VIDEO" | "AUDIO" | "FILE";
  content?: string;
  mediaUrl?: string;
  readBy: string[];
  createdAt: string;
}

export interface SearchUser {
  _id: string;
  firstName: string;
  lastName: string;
  role: string;
  profilePicture?: string;
}

export const chatService = {
  // =========================================================
  // 🔍 SEARCH USERS
  // =========================================================
  searchUsers: (username: string, callback: (data: SearchUser[]) => void) => {
    socketService.off("searchUsers"); // 🔥 important

    socketService.on("searchUsers", (data: SearchUser[]) => {
      callback(data);
    });

    socketService.emit("searchUsers", { username });
  },

  // =========================================================
  // 🆕 CREATE CONVERSATION
  // =========================================================
  createConversation: (receiverId: string, callback: (data: any) => void) => {
    socketService.on("createConversation", callback);
    socketService.emit("createConversation", { receiverId });
  },

  // =========================================================
  // 📜 GET CONVERSATIONS
  // =========================================================
  getConversations: (
    page: number = 1,
    limit: number = 10,
    callback: (data: Conversation[]) => void,
  ) => {
    socketService.off("conversations");

    socketService.on("conversations", (data: Conversation[]) => {
      callback(data);
    });

    socketService.emit("conversations", { page, limit });
  },

  // =========================================================
  // 📩 GET MESSAGES
  // =========================================================
  getMessages: (
    conversationId: string,
    page: number = 1,
    limit: number = 20,
    callback: (data: Message[]) => void,
  ) => {
    socketService.on("getMessages", callback);
    socketService.emit("getMessages", {
      conversationId,
      page,
      limit,
    });
  },

  // =========================================================
  // ✉ SEND MESSAGE
  // =========================================================
  sendMessage: (data: {
    conversationId: string;
    messageType: "TEXT" | "IMAGE" | "VIDEO" | "AUDIO" | "FILE";
    content?: string;
    mediaUrl?: string;
  }) => {
    socketService.emit("message", data);
  },

  // =========================================================
  // 🔥 LISTENERS
  // =========================================================
  onMessage: (callback: (message: Message) => void) => {
    socketService.on("message", callback);
  },

  onUnreadUpdate: (
    callback: (data: { conversationId: string; unreadCount: number }) => void,
  ) => {
    socketService.on("unreadUpdate", callback);
  },

  onNewConversation: (callback: (data: any) => void) => {
    socketService.on("newConversation", callback);
  },

  onError: (callback: (error: { message: string }) => void) => {
    socketService.on("error", callback);
  },

  markAsRead: (conversationId: string) => {
    socketService.emit("markAsRead", { conversationId });
  },

  removeListener: (event: string, callback?: (...args: any[]) => void) => {
    socketService.off(event, callback);
  },
};
