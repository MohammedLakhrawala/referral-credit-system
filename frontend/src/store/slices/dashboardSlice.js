import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";

export const fetchOverview = createAsyncThunk(
  "dashboard/fetchOverview",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/dashboard/overview");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const buyProduct = createAsyncThunk(
  "dashboard/buyProduct",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.post("/purchases/buy");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: { overview: null, loading: false, error: null, lastPurchaseResult: null },
  reducers: {
    clearLastPurchase(state) { state.lastPurchaseResult = null; }
  },
  extraReducers: (b) => {
    b.addCase(fetchOverview.pending, (s) => { s.loading = true; s.error = null; })
     .addCase(fetchOverview.fulfilled, (s, a) => { s.loading = false; s.overview = a.payload || a; })
     .addCase(fetchOverview.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

     .addCase(buyProduct.pending, (s) => { s.loading = true; s.error = null; })
     .addCase(buyProduct.fulfilled, (s, a) => {
       s.loading = false;
       s.lastPurchaseResult = a.payload;
       // refresh overview from payload if we got updated user
       if (a.payload && a.payload.user) {
         if (!s.overview) s.overview = {};
         s.overview.credits = a.payload.user.credits;
         s.overview.totalPurchases = (s.overview.totalPurchases || 0) + (a.payload.isFirstPurchase ? 1 : 1);
       }
     })
     .addCase(buyProduct.rejected, (s, a) => { s.loading = false; s.error = a.payload; });
  }
});

export const { clearLastPurchase } = dashboardSlice.actions;
export default dashboardSlice.reducer;
