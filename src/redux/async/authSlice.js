import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://fe-react-agency-api-dash.vercel.app';

export const loginUser = createAsyncThunk('auth/loginUser', async ({ email, password, rememberMe }) => {
  const response = await axios.post(`${API_URL}/auth/login`, { email, password });
  const { token, user } = response.data;
  const expiration = rememberMe ? 7 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000;
  localStorage.setItem('token', token);
  localStorage.setItem('token_expiration', Date.now() + expiration);
  return { user, token };
});

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  const token = localStorage.getItem('token');
  try {
    await axios.post(
      `${API_URL}/auth/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`, // Kirim token dalam header
        },
      }
    );
  } catch (error) {
    console.error('Logout API failed:', error.response?.data || error.message);
    throw error;
  }
});

export const getProfile = createAsyncThunk('auth/getProfile', async (_, { rejectWithValue }) => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.get(`${API_URL}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.user;
  } catch (error) {
    console.error('Error fetching profile:', error.response?.data || error.message);
    return rejectWithValue(error.response?.data || error.message);
  }
});
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('token_expiration');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(logoutUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.status = 'succeeded';
        state.user = null;
        state.token = null;
        localStorage.removeItem('token');
        localStorage.removeItem('token_expiration');
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(getProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        state.user = action.payload; // Simpan data user ke state Redux
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload; // Simpan error ke state Redux
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
