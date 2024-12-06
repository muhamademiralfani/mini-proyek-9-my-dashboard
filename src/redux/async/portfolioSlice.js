import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://fe-react-agency-api-dash.vercel.app';

// Helper function to get the token
const getAuthToken = () => {
  // Replace with your logic to get token from Redux or localStorage
  const token = localStorage.getItem('token'); // Example: token stored in localStorage
  return token ? `Bearer ${token}` : null;
};

// Fetch portfolios
export const fetchPortfolios = createAsyncThunk(
  'portfolio/fetchPortfolios',
  async ({ page = 1, limit = 5, search = '' }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/portfolio`, {
        params: { page, limit, search },
        headers: {
          Authorization: getAuthToken(),
        },
      });
      return response.data.data; // Sesuaikan dengan struktur respons API
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch portfolios');
    }
  }
);

export const fetchPortfolioDetails = createAsyncThunk('portfolio/fetchPortfolioDetails', async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/portfolio/${id}`, {
      headers: {
        Authorization: getAuthToken(),
      },
    });
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to fetch portfolio details');
  }
});

// Create a new portfolio
export const createPortfolio = createAsyncThunk('portfolio/createPortfolio', async (portfolioData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/portfolio`, portfolioData, {
      headers: {
        'Authorization': getAuthToken(),
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to create portfolio');
  }
});

// Update an existing portfolio
export const updatePortfolio = createAsyncThunk('portfolio/updatePortfolio', async ({ id, portfolioData }, { rejectWithValue }) => {
  console.log('ID:', id);
  console.log('Data being sent:', [...portfolioData.entries()]);

  try {
    const response = await axios.put(`${API_URL}/portfolio/${id}`, portfolioData, {
      headers: {
        'Authorization': getAuthToken(),
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Update Error:', error.response?.data);
    return rejectWithValue(error.response?.data || 'Failed to update portfolio');
  }
});

// Delete a portfolio
export const deletePortfolio = createAsyncThunk('portfolio/deletePortfolio', async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`${API_URL}/portfolio/${id}`, {
      headers: {
        Authorization: getAuthToken(),
      },
    });
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to delete portfolio');
  }
});

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState: {
    portfolios: [],
    portfolio: {},
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPortfolios.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPortfolios.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        state.portfolios = action.payload;
      })
      .addCase(fetchPortfolios.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(fetchPortfolioDetails.fulfilled, (state, action) => {
        state.portfolioDetails = action.payload;
      })

      .addCase(createPortfolio.fulfilled, (state, action) => {
        state.portfolios.push(action.payload);
      })
      .addCase(updatePortfolio.fulfilled, (state, action) => {
        state.error = null;
        state.portfolios = action.payload;
        // state.portfolios = state.portfolios.map((p) => (p.id === action.payload.id ? action.payload : p));
      })
      .addCase(deletePortfolio.fulfilled, (state, action) => {
        state.portfolios = state.portfolios.filter((p) => p.id !== action.payload);
      });
  },
});

export default portfolioSlice.reducer;
