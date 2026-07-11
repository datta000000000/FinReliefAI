import api from './api';

const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    if (response.success && response.data?.access_token) {
      localStorage.setItem('token', response.data.access_token);
    }
    return response;
  },

  async register(name, email, password, mobile_number = null, profile_image = null) {
    return await api.post('/auth/register', { 
      name, 
      email, 
      password,
      mobile_number,
      profile_image
    });
  },

  logout() {
    localStorage.removeItem('token');
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
};

export default authService;
