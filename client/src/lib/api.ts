import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
});

// Add a request interceptor to include the Auth Token
api.interceptors.request.use((config) => {
  // Check if we are in the browser before accessing localStorage
  if (typeof window !== 'undefined') {
    const storage = localStorage.getItem('solveit-storage');
    if (storage) {
      try {
        const { state } = JSON.parse(storage);
        if (state.token) {
          config.headers.Authorization = `Bearer ${state.token}`;
          config.headers['x-user-id'] = state.user?.id;
        } else {
          config.headers['x-user-id'] = 'demo-user-id';
        }
      } catch (e) {
        config.headers['x-user-id'] = 'demo-user-id';
      }
    } else {
      config.headers['x-user-id'] = 'demo-user-id';
    }
  } else {
    // Server-side (no auth header or handle differently if using cookies)
    config.headers['x-user-id'] = 'demo-user-id-server';
  }
  return config;
});

export default api;
