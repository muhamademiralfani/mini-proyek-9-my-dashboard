import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://fe-react-agency-api-dash.vercel.app';

// Helper function to get the token
const getAuthToken = () => {
  const token = localStorage.getItem('token');
  return token ? `Bearer ${token}` : null;
};

// Fetch Dashboard Totals
export const fetchDashboardTotals = createAsyncThunk(
  'dashboard/fetchTotals',
  async (_, { rejectWithValue }) => {
    try {
      const responses = await Promise.all([
        axios.get(`${API_URL}/testimonial`, { headers: { Authorization: getAuthToken() } }),
        axios.get(`${API_URL}/blogs`, { headers: { Authorization: getAuthToken() } }),
        axios.get(`${API_URL}/portfolio`, { headers: { Authorization: getAuthToken() } }),
      ]);

      return {
        testimonials: responses[0].data.data.length,
        blogs: responses[1].data.data.length,
        portfolios: responses[2].data.data.length,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch dashboard totals');
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    totals: {
      testimonials: 0,
      blogs: 0,
      portfolios: 0,
    },
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardTotals.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDashboardTotals.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.totals = action.payload;
        state.error = null;
      })
      .addCase(fetchDashboardTotals.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
