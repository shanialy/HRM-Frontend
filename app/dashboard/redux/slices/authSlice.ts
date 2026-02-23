import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  _id: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
}

const initialState: AuthState = {
  token: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user: User }>
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },

    // Hydrate from localStorage on app load
    hydrateAuth: (state) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        const userStr = localStorage.getItem("user");

        if (token && userStr) {
          state.token = token;
          state.user = JSON.parse(userStr);
        }
      }
    },

    logout: (state) => {
      state.token = null;
      state.user = null;

      // Clear localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
      }
    },
  },
});

// ✅ VERY IMPORTANT
export const { setCredentials, hydrateAuth, logout } = authSlice.actions;

export default authSlice.reducer;
