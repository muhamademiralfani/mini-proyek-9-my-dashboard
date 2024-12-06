import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

const initialState = {
  blogs: [],
  blogDetails: {},
  status: 'idle',
  error: null,
};

// Fetch Blogs
export const fetchBlogs = createAsyncThunk('blogs/fetchBlogs', async ({ page = 1, limit = 5, search = '' }, { rejectWithValue }) => {
  try {
    const response = await API.get(`/blogs?page=${page}&limit=${limit}&search=${search}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Fetch Blog Details
export const fetchBlogDetails = createAsyncThunk('blogs/fetchBlogDetails', async (id, { rejectWithValue }) => {
  try {
    const response = await API.get(`/blogs/${id}`);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Create Blog
export const createBlog = createAsyncThunk('blogs/createBlog', async (blogData, { rejectWithValue }) => {
  try {
    const response = await API.post('/blogs', blogData, {
      headers: { 'Content-Type': 'multipart/form-data' }, // FormData untuk upload file
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Update Blog
export const updateBlog = createAsyncThunk('blogs/updateBlog', async ({ id, blogData }, { rejectWithValue }) => {
  try {
    const response = await API.put(`/blogs/${id}`, blogData, {
      headers: { 'Content-Type': 'multipart/form-data' }, // FormData untuk upload file
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Delete Blog
export const deleteBlog = createAsyncThunk('blogs/deleteBlog', async (id, { rejectWithValue }) => {
  try {
    await API.delete(`/blogs/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

const blogSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Blogs
      .addCase(fetchBlogs.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        state.blogs = action.payload.data;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Fetch Blog Details
      .addCase(fetchBlogDetails.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchBlogDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        state.blogDetails = action.payload;
      })
      .addCase(fetchBlogDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Create Blog
      .addCase(createBlog.fulfilled, (state, action) => {
        state.blogs.unshift(action.payload);
      })

      // Update Blog
      .addCase(updateBlog.fulfilled, (state, action) => {
        const index = state.blogs.findIndex((blog) => blog.id === action.payload.id);
        if (index !== -1) {
          state.blogs[index] = action.payload;
        }

        // Update blogDetails if it's the same blog
        if (state.blogDetails && state.blogDetails.id === action.payload.id) {
          state.blogDetails = action.payload;
        }
      })

      // Delete Blog
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.blogs = state.blogs.filter((blog) => blog.id !== action.payload);

        // Clear blogDetails if it's the deleted blog
        if (state.blogDetails && state.blogDetails.id === action.payload) {
          state.blogDetails = null;
        }
      });
  },
});

export default blogSlice.reducer;
