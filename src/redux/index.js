// redux/index.js
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from '@reduxjs/toolkit';
import authSlice from './async/authSlice';
import userSlice from './async/userSlice';
import { persistStore, persistReducer } from 'redux-persist';
import blogReducer from './async/blogSlice';
import testimonialSlice from './async/testimonialSlice';
import portfolioSlice from './async/portfolioSlice';
import contactSlice from './async/contactSlice';
import storage from 'redux-persist/lib/storage';

// Create a persist configuration
const persistConfig = {
  key: 'root', // key for the persisted state
  storage, // storage engine (localStorage in this case)
};

const tokenMiddleware = (store) => (next) => (action) => {
  const tokenExpiration = localStorage.getItem('token_expiration');
  if (tokenExpiration && Date.now() > parseInt(tokenExpiration)) {
    localStorage.removeItem('token');
    localStorage.removeItem('token_expiration');
    window.location.href = '/login'; // Redirect langsung
  }
  return next(action);
};

// Combine your reducers
const rootReducer = combineReducers({
  auth: authSlice,
  users: userSlice,
  blogs: blogReducer,
  portfolio: portfolioSlice,
  contact: contactSlice,
  testimonial : testimonialSlice,
});

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(tokenMiddleware),
});

// Create a persistor
export const persistor = persistStore(store);

export default store;
