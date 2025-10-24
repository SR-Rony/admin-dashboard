import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// ============================
// 🔹 Interfaces
// ============================
interface User {
  _id?: string;
  email: string;
  name?: string;
  token?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  token: string | null;
}

// ============================
// 🔹 Initial State
// ============================
const savedUser =
  typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("user") || "null")
    : null;

const savedToken =
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

const initialState: AuthState = {
  user: savedUser,
  loading: false,
  error: null,
  token: savedToken,
};

// ============================
// 🔹 Login Thunk
// ============================
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/auth/login",
        { email, password }
      );

      const data = response.data;

      // ✅ Normalize the response here
      const user = data?.payload?.user;
      const token = data?.payload?.accessToken;

      // Save in localStorage
      if (user && token) {
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
        localStorage.setItem("userId", user._id);
      }

      // Return flat structure for reducers
      return { user, token };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

// ============================
// 🔹 Fetch User Profile Thunk
// ============================
export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (id: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return rejectWithValue("No token found");
      if (!id) return rejectWithValue("User ID is required");

      const response = await axios.get(`http://localhost:4000/api/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data.payload?.user || response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch user profile"
      );
    }
  }
);

// ============================
// 🔹 Slice
// ============================
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userId");
    },
    setUserFromStorage: (state, action) => {
      state.user = action.payload.user || null;
      state.token = action.payload.token || null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user || null;
        state.token = action.payload.token || null;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload || null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// ============================
// 🔹 Exports
// ============================
export const { logout, setUserFromStorage } = authSlice.actions;
export default authSlice.reducer;
