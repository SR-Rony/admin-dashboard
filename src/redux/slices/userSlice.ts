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

const getUserFromLocalStorage = (): User | null => {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};

const initialState: AuthState = {
  user: getUserFromLocalStorage(),
  loading: false,
  error: null,
};

// ✅ Login thunk
export const loginUser = createAsyncThunk<
  User,
  { email: string; password: string },
  { rejectValue: string }
>("auth/loginUser", async ({ email, password }, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.post("/auth/login", { email, password });
    const user = data?.payload?.user;

    if (user) localStorage.setItem("user", JSON.stringify(user));

    return user;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Invalid email or password");
  }
});

// ✅ Logout thunk
export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  try {
    await axiosInstance.post("/auth/logout");
  } catch (err) {
    console.warn("Logout request failed, but proceeding to clear local data.");
  } finally {
    localStorage.removeItem("user");
    sessionStorage.clear();
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
      // Login
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
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.loading = false;
        state.error = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
