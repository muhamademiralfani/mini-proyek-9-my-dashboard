import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://fe-react-agency-api-dash.vercel.app';

export const fetchUsers = createAsyncThunk('users/fetchUsers', async (params = {}) => {
  const token = localStorage.getItem('token');
  const { search, page = 1, limit = 10 } = params; // Tambahkan query parameter
  const response = await axios.get(`${API_URL}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      search, // Query parameter untuk pencarian
      page,
      limit,
    },
  });
  return response.data.data;
});

export const fetchUserDetails = createAsyncThunk('users/fetchUserDetails', async (id) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
});

export const createUser = createAsyncThunk('users/createUser', async (data) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(`${API_URL}/users`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
});

export const updateUser = createAsyncThunk('users/updateUser', async ({ id, data }) => {
  const token = localStorage.getItem('token');
  const response = await axios.put(`${API_URL}/users/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
});

export const deleteUser = createAsyncThunk('users/deleteUser', async (id) => {
  const token = localStorage.getItem('token');
  const response = await axios.delete(`${API_URL}/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
});

const userSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    user: {},
    status: 'idle',
    error: null,
  },
  extraReducers: (builder) => {
    builder
      // Fetch User
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // Fetch User Details
      .addCase(fetchUserDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        state.user = action.payload;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // Create Users
      .addCase(createUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createUser.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(createUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload; // Update the user in the
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = state.users.filter((user) => user.id !== action.meta.arg);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default userSlice.reducer;
