import api from './api';

export const watchlistService = {
  async getAll() {
    const { data } = await api.get('/watchlist');
    return data;
  },

  async add(asteroidId, alertDistanceKm = 1000000) {
    const { data } = await api.post('/watchlist', {
      asteroid_id: asteroidId,
      alert_distance_km: alertDistanceKm,
    });
    return data;
  },

  async update(asteroidId, alertDistanceKm) {
    const { data } = await api.put(`/watchlist/${asteroidId}`, {
      alert_distance_km: alertDistanceKm,
    });
    return data;
  },

  async remove(asteroidId) {
    await api.delete(`/watchlist/${asteroidId}`);
  },

  async getCount() {
    const { data } = await api.get('/watchlist/count');
    return data;
  },
};
