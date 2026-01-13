import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
});

// Add a request interceptor to include the Auth Token
api.interceptors.request.use((config) => {
  // We need to read from localStorage directly because using the hook inside logic is tricky
  // But since we use persist middleware, we can try to parse it.
  // Or simpler: just let the store handle it? Store is React based.
  // Standard way:
  const storage = localStorage.getItem('solveit-storage');
  if (storage) {
    const { state } = JSON.parse(storage);
    if (state.token) {
      config.headers.Authorization = `Bearer ${state.token}`;
      config.headers['x-user-id'] = state.user?.id;
    } else {
      // Fallback for guest mode
      config.headers['x-user-id'] = 'demo-user-id';
    }
  } else {
    // Fallback if no storage at all
    config.headers['x-user-id'] = 'demo-user-id';
  }
  return config;
});

export default api;
