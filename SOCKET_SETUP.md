# Socket.IO Chat Setup

## Installation

Run this command to install socket.io-client:

```bash
npm install socket.io-client
```

## What Was Implemented

### 1. Socket Service (`app/services/socket.service.ts`)
- Singleton pattern for managing socket connection
- Auto-connects with JWT token
- Handles connect/disconnect events

### 2. Chat Service (`app/services/chat.service.ts`)
- Wrapper functions for all socket events:
  - `createConversation` - Create or get existing conversation
  - `getConversations` - Fetch all conversations with pagination
  - `getMessages` - Fetch messages for a conversation
  - `sendMessage` - Send text/media messages
  - `markAsRead` - Mark messages as read
  - `onMessage` - Listen for real-time messages
  - `onNewConversation` - Listen for new conversations

### 3. Socket Provider (`app/dashboard/providers/SocketProvider.tsx`)
- Automatically connects socket when user logs in
- Uses token from Redux store
- Disconnects on logout

### 4. Updated Pages

#### Chat List (`app/dashboard/conversation-list/chat-list/page.tsx`)
- Fetches real conversations from backend
- Shows unread count
- Real-time updates when new messages arrive
- Displays other user's name and avatar
- Time formatting (just now, X min ago, etc.)

#### Conversation Page (`app/dashboard/conversation-list/page.tsx`)
- Real-time messaging
- Auto-scrolls to latest message
- Shows sender name and avatar
- Mark messages as read automatically
- Displays message timestamps

## How It Works

1. User logs in → Token stored in Redux
2. SocketProvider connects to backend with token
3. Backend authenticates via JWT middleware
4. User joins their personal room + all conversation rooms
5. Real-time events flow through socket connection

## Backend Events (Already Implemented)

- `createConversation` - Create new chat
- `conversations` - Get conversation list
- `message` - Send/receive messages
- `getMessages` - Fetch message history
- `markAsRead` - Mark as read
- `newConversation` - Notify about new chats

## Usage Example

### Start a new conversation (from employee list):
```typescript
import { chatService } from "@/app/services/chat.service";

// When clicking on an employee
chatService.createConversation(employeeId, (conversation) => {
  router.push(`/dashboard/conversation-list?chatId=${conversation._id}`);
});
```

### Send a message:
```typescript
chatService.sendMessage({
  conversationId: "123",
  messageType: "TEXT",
  content: "Hello!",
});
```

## Next Steps

1. Install socket.io-client: `npm install socket.io-client`
2. Test the chat functionality
3. Add file upload support (IMAGE, VIDEO, FILE types)
4. Add typing indicators (optional)
5. Add online/offline status (optional)
