import api from './api';

export const authService = {
  async register(email, password) {
    const { data } = await api.post('/auth/register', { email, password });
    if (data.access_token) {
      localStorage.setItem('token', data.access_token);
    }
    return data;
  },

  async login(email, password) {
    const { data } = await api.post('/auth/login', { email, password });
    if (data.access_token) {
      localStorage.setItem('token', data.access_token);
    }
    return data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  async getProfile() {
    const { data } = await api.get('/auth/me');
    return data;
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  getToken() {
    return localStorage.getItem('token');
  },
};
