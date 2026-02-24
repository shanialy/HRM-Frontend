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
    // Search users by username
    searchUsers: (username: string, callback: (data: SearchUser[]) => void) => {
        socketService.emit("searchUsers", { username });
        socketService.on("searchUsers", callback);
    },

    // Create or get conversation
    createConversation: (receiverId: string, callback: (data: any) => void) => {
        socketService.emit("createConversation", { receiverId });
        socketService.on("createConversation", callback);
    },

    // Get all conversations
    getConversations: (
        page: number = 1,
        limit: number = 10,
        callback: (data: Conversation[]) => void
    ) => {
        socketService.emit("conversations", { page, limit });
        socketService.on("conversations", callback);
    },

    // Get messages for a conversation
    getMessages: (
        conversationId: string,
        page: number = 1,
        limit: number = 20,
        callback: (data: Message[]) => void
    ) => {
        socketService.emit("getMessages", { conversationId, page, limit });
        socketService.on("getMessages", callback);
    },

    // Send message
    sendMessage: (data: {
        conversationId: string;
        messageType: "TEXT" | "IMAGE" | "VIDEO" | "AUDIO" | "FILE";
        content?: string;
        mediaUrl?: string;
    }) => {
        socketService.emit("message", data);
    },

    // Listen for new messages
    onMessage: (callback: (message: Message) => void) => {
        socketService.on("message", callback);
    },

    // Mark messages as read
    markAsRead: (conversationId: string) => {
        socketService.emit("markAsRead", { conversationId });
    },

    // Listen for new conversations
    onNewConversation: (callback: (data: any) => void) => {
        socketService.on("newConversation", callback);
    },

    // Listen for errors
    onError: (callback: (error: { message: string }) => void) => {
        socketService.on("error", callback);
    },

    // Clean up listeners
    removeListener: (event: string, callback?: (...args: any[]) => void) => {
        socketService.off(event, callback);
    },
};
