// store/slices/userSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axiosInstance";

interface User {
  _id?: string;
  name?: string;
  phone?: string;
  role?: string;
  isVerified?: boolean;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

// ✅ Login thunk
export const loginUser = createAsyncThunk<
  User,
  { phone: string; password: string },
  { rejectValue: string }
>("auth/loginUser", async ({ phone, password }, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.post("/auth/login", { phone, password });
    const user = data?.payload?.user;

    if (!user) return rejectWithValue("User not found");
    if (!user.isVerified) return rejectWithValue("Please verify your phone number first");

    return user;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Invalid phone or password");
  }
});

// ✅ Logout thunk
export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  try {
    await axiosInstance.post("/auth/logout");
  } catch {
    console.warn("Logout request failed — clearing local storage anyway.");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
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
        state.error = action.payload || "Login failed";
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.loading = false;
        state.error = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
