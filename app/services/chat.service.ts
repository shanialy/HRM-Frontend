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
    socketService.off("searchUsers"); // 🔥 FIX: remove old listener
    socketService.on("searchUsers", callback); // 🔥 FIX: listener FIRST
    socketService.emit("searchUsers", { username }); // 🔥 THEN emit
  },

  // =========================================================
  // 🆕 CREATE CONVERSATION
  // =========================================================
  createConversation: (receiverId: string, callback: (data: any) => void) => {
    socketService.off("createConversation"); // 🔥 FIX: prevent duplicate listeners
    socketService.on("createConversation", callback); // 🔥 listener first
    socketService.emit("createConversation", { receiverId }); // 🔥 then emit
  },

  // =========================================================
  // 📜 GET CONVERSATIONS (MAIN FIX HERE)
  // =========================================================
  getConversations: (
    page: number = 1,
    limit: number = 10,
    callback: (data: Conversation[]) => void,
  ) => {
    socketService.on("conversations", callback); // 🔥 listener FIRST (important)
    socketService.emit("conversations", { page, limit }); // 🔥 THEN emit
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
    socketService.off("getMessages"); // 🔥 FIX: prevent stacking listeners
    socketService.on("getMessages", callback); // 🔥 listener first
    socketService.emit("getMessages", { conversationId, page, limit }); // 🔥 then emit
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
  // 🔥 LISTEN FOR NEW MESSAGE
  // =========================================================
  onMessage: (callback: (message: Message) => void) => {
    socketService.off("message"); // 🔥 FIX: avoid duplicate firing
    socketService.on("message", callback);
  },

  // =========================================================
  // 🔥 LISTEN FOR UNREAD UPDATE
  // =========================================================
  onUnreadUpdate: (
    callback: (data: { conversationId: string; unreadCount: number }) => void,
  ) => {
    socketService.off("unreadUpdate"); // 🔥 FIX
    socketService.on("unreadUpdate", callback);
  },

  // =========================================================
  // 🔥 MARK AS READ
  // =========================================================
  markAsRead: (conversationId: string) => {
    socketService.emit("markAsRead", { conversationId });
  },

  // =========================================================
  // 🔥 LISTEN FOR NEW CONVERSATION
  // =========================================================
  onNewConversation: (callback: (data: any) => void) => {
    socketService.off("newConversation"); // 🔥 FIX
    socketService.on("newConversation", callback);
  },

  // =========================================================
  // ⚠ LISTEN FOR ERRORS
  // =========================================================
  onError: (callback: (error: { message: string }) => void) => {
    socketService.off("error"); // 🔥 FIX
    socketService.on("error", callback);
  },

  // =========================================================
  // 🧹 CLEAN UP
  // =========================================================
  removeListener: (event: string, callback?: (...args: any[]) => void) => {
    socketService.off(event, callback);
  },
};
