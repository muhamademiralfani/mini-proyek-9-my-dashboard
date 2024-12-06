import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://fe-react-agency-api-dash.vercel.app';

// Helper function to get the token
const getAuthToken = () => {
  const token = localStorage.getItem('token');
  return token ? `Bearer ${token}` : null;
};

// Fetch testimonials
export const fetchTestimonials = createAsyncThunk('testimonial/fetchTestimonials', async ({ page = 1, limit = 5, search = '' }, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/testimonial`, {
      params: { page, limit, search },
      headers: {
        Authorization: getAuthToken(),
      },
    });
    return response.data.data; // Sesuaikan dengan struktur respons API
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to fetch testimonial');
  }
});

// Fetch testimonial details
export const fetchTestimonialDetails = createAsyncThunk('testimonial/fetchTestimonialDetails', async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/testimonial/${id}`, {
      headers: {
        Authorization: getAuthToken(),
      },
    });
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to fetch testimonial details');
  }
});

// Create a new testimonial
export const createTestimonial = createAsyncThunk('testimonial/createTestimonials', async (testimonialData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/testimonial`, testimonialData, {
      headers: {
        'Authorization': getAuthToken(),
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to create testimonials');
  }
});

// Update an existing testimonial
export const updateTestimonial = createAsyncThunk('testimonial/updateTestimonials', async ({ id, testimonialData }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${API_URL}/testimonial/${id}`, testimonialData, {
      headers: {
        'Authorization': getAuthToken(),
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to update testimonials');
  }
});

// Delete a testimonial
export const deleteTestimonial = createAsyncThunk('testimonial/deleteTestimonials', async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`${API_URL}/testimonial/${id}`, {
      headers: {
        Authorization: getAuthToken(),
      },
    });
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to delete testimonial');
  }
});

const testimonialSlice = createSlice({
  name: 'testimonial',
  initialState: {
    testimonials: [],
    testimonialDetails: {},
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTestimonials.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTestimonials.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        state.testimonials = action.payload;
      })
      .addCase(fetchTestimonials.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchTestimonialDetails.fulfilled, (state, action) => {
        state.testimonialDetails = action.payload;
      })
      .addCase(createTestimonial.fulfilled, (state, action) => {
        state.testimonials.push(action.payload);
      })
      .addCase(updateTestimonial.fulfilled, (state, action) => {
        state.testimonials = state.testimonials.map((t) => (t.id === action.payload.id ? action.payload : t));
      })
      .addCase(deleteTestimonial.fulfilled, (state, action) => {
        state.testimonials = state.testimonials.filter((t) => t.id !== action.payload);
      });
  },
});

export default testimonialSlice.reducer;
