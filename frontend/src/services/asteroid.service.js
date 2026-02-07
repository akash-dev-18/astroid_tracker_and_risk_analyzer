import api from './api';

export const asteroidService = {
  async getFeed(params = {}) {
    const { data } = await api.get('/asteroids/feed', { params });
    return data;
  },

  async getById(id) {
    const { data } = await api.get(`/asteroids/${id}`);
    return data;
  },

  async search(query) {
    const { data } = await api.get('/asteroids/search', { params: { q: query } });
    return data;
  },

  async getHazardous(limit = 50) {
    const { data } = await api.get('/asteroids/hazardous', { params: { limit } });
    return data;
  },

  async syncNasaData(startDate, endDate) {
    const params = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    const { data } = await api.post('/asteroids/sync', null, { params });
    return data;
  },
};
