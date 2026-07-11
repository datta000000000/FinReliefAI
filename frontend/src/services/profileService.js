import api from './api';

const profileService = {
  async getProfile() {
    return await api.get('/api/profiles');
  },

  async createProfile(profileData) {
    return await api.post('/api/profiles', profileData);
  },

  async updateProfile(profileData) {
    return await api.put('/api/profiles', profileData);
  },

  async deleteProfile() {
    return await api.delete('/api/profiles');
  },

  async getUserProfile() {
    return await api.get('/api/users/me');
  },

  async updateUserProfile(userData) {
    return await api.put('/api/users/me', userData);
  }
};

export default profileService;
