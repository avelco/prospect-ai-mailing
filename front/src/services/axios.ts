import axios from 'axios';

const baseURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL,
  // You can add more default config here, like headers, timeout, etc.
});

export default api;
