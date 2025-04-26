import axios from 'axios';

const env = import.meta.env.VITE_ENV;

let baseURL = '';

if (env === 'production') {
  baseURL = import.meta.env.VITE_PROD_BACKEND_URL;
} else {
  baseURL = import.meta.env.VITE_DEV_BACKEND_URL;
}

const api = axios.create({
  baseURL,
});

export default api;
