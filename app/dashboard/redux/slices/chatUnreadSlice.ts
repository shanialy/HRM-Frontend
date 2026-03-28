import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { logout } from "./authSlice";
import type { Conversation } from "@/app/services/chat.service";

function unreadForUser(chat: Conversation, userId: string): number {
  return chat.unreadCount ?? chat.unreadCounts?.[userId] ?? 0;
}

export interface ChatUnreadState {
  unreadByConversation: Record<string, number>;
}

const initialState: ChatUnreadState = {
  unreadByConversation: {},
};

const chatUnreadSlice = createSlice({
  name: "chatUnread",
  initialState,
  reducers: {
    setUnreadMapFromConversations: (
      state,
      action: PayloadAction<{ conversations: Conversation[]; userId: string }>,
    ) => {
      const { conversations, userId } = action.payload;
      const next: Record<string, number> = {};
      for (const c of conversations) {
        next[c._id] = unreadForUser(c, userId);
      }
      state.unreadByConversation = next;
    },
    setConversationUnread: (
      state,
      action: PayloadAction<{ conversationId: string; unreadCount: number }>,
    ) => {
      const { conversationId, unreadCount } = action.payload;
      if (unreadCount <= 0) {
        delete state.unreadByConversation[conversationId];
      } else {
        state.unreadByConversation[conversationId] = unreadCount;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout, () => initialState);
  },
});

export const { setUnreadMapFromConversations, setConversationUnread } =
  chatUnreadSlice.actions;

export const selectChatTotalUnread = (state: { chatUnread: ChatUnreadState }) =>
  Object.values(state.chatUnread.unreadByConversation).reduce(
    (sum, n) => sum + n,
    0,
  );

export default chatUnreadSlice.reducer;
