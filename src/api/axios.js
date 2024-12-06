import axios from 'axios';

const API = axios.create({
  baseURL: 'https://fe-react-agency-api-dash.vercel.app',
});

// Tambahkan interceptor untuk header Authorization
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
