import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    if (response.data && response.data.hasOwnProperty('success')) {
      return response.data;
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      const isLoginPath = window.location.pathname === '/login';
      const isRegisterPath = window.location.pathname === '/register';

      if (!isLoginPath && !isRegisterPath) {
        localStorage.removeItem('token');
        window.location.href = '/login?expired=true';
      }
    }

    const errorData = error.response?.data || {
      success: false,
      message: 'Network connection error. Please try again.',
      errors: ['Failed to reach the server.'],
    };

    return Promise.reject(errorData);
  }
);

export default api;