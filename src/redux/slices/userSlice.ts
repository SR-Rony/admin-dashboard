import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axiosInstance";

interface User {
  _id?: string;
  name?: string;
  email: string;
  role?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const savedUser =
  typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("user") || "null")
    : null;

const initialState: AuthState = {
  user: savedUser,
  loading: false,
  error: null,
};

// Login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosInstance.post("/auth/login", { email, password });
      const user = res.data?.payload?.user;

      if (user) localStorage.setItem("user", JSON.stringify(user));

      return user;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

// Logout
export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  await axiosInstance.post("/auth/logout"); // backend cookies clear
  localStorage.removeItem("user");
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export default authSlice.reducer;
