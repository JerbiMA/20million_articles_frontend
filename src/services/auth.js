import api from './api';

export const authService = {
  register: async (userData) => {
    return api.post('/auth/register', userData);
  },
  login: async (credentials) => {
    return api.post('/auth/login', credentials);
  },
  logout: async () => {
    return api.post('/auth/logout');
  },
  getMe: async () => {
    return api.get('/auth/me');
  },
  getProfile: async () => {
    return api.get('/users/profile');
  },
  updateProfile: async (data) => {
    return api.put('/users/profile', data);
  },
  changePassword: async (data) => {
    return api.put('/users/change-password', data);
  },
};
