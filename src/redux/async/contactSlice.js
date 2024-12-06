import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://fe-react-agency-api-dash.vercel.app';

// Helper function to get the token
const getAuthToken = () => {
  const token = localStorage.getItem('token');
  return token ? `Bearer ${token}` : null;
};

// Fetch all contacts
export const fetchContacts = createAsyncThunk(
  'contact/fetchContacts',
  async ({ page = 1, limit = 5, search = '' }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/contact`, {
        params: { page, limit, search },
        headers: {
          Authorization: getAuthToken(),
        },
      });
      return response.data.data; // Adjust based on API response structure
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch contacts');
    }
  }
);

// Fetch contact details by ID
export const fetchContactDetails = createAsyncThunk(
  'contact/fetchContactDetails',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/contact/${id}`, {
        headers: {
          Authorization: getAuthToken(),
        },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch contact details');
    }
  }
);

const contactSlice = createSlice({
  name: 'contact',
  initialState: {
    contacts: [],
    contactDetails: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.contacts = action.payload || [];
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchContactDetails.fulfilled, (state, action) => {
        state.contactDetails = action.payload;
      });
  },
});

export default contactSlice.reducer;
