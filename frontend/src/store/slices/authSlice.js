import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api, { setAuthToken } from "@/lib/api";

// load initial auth state from localStorage
const tokenFromStorage = typeof window !== "undefined" ? localStorage.getItem("token") : null;
const userFromStorage = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "null") : null;
if (tokenFromStorage) setAuthToken(tokenFromStorage);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ name, email, password, referralCode }, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/register", { name, email, password, referralCode });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const initialState = {
  user: userFromStorage,
  token: tokenFromStorage,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
      setAuthToken(null);
    },
    setCredentials(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      if (typeof window !== "undefined") {
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      }
      setAuthToken(action.payload.token);
    },
  },
  extraReducers: (builder) => {
    builder
      // register
      .addCase(registerUser.pending, (state) => {
        state.loading = true; state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        setAuthToken(action.payload.token);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false; state.error = action.payload;
      })
      // login
      .addCase(loginUser.pending, (state) => {
        state.loading = true; state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        setAuthToken(action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false; state.error = action.payload;
      });
  },
});

export const { logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;
