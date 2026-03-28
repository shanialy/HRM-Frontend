import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import chatUnreadReducer from "./slices/chatUnreadSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chatUnread: chatUnreadReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
