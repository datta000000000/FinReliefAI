import axios from 'axios';

// Base Axios Client setup using relative URL paths (Proxied through Vite during development)
const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Automatically inject active JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle 401 unauthorized errors (Auto-logout)
api.interceptors.response.use(
  (response) => {
    // If the backend returns standard API wrapper, extract data
    if (response.data && response.data.hasOwnProperty('success')) {
      return response.data; // Return the parsed backend body
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      const isLoginPath = window.location.pathname === '/login';
      const isRegisterPath = window.location.pathname === '/register';
      if (!isLoginPath && !isRegisterPath) {
        localStorage.removeItem('token');
        window.location.href = '/login?expired=true';
      }
    }
    
    // Normalize errors for easy component rendering
    const errorData = error.response?.data || {
      success: false,
      message: 'Network connection error. Please try again.',
      errors: ['Failed to reach the server.'],
    };
    return Promise.reject(errorData);
  }
);

export default api;
