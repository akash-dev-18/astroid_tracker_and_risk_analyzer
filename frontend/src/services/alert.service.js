import api from './api';

export const alertService = {
  async getAll(params = {}) {
    const { data } = await api.get('/alerts', { params });
    return data;
  },

  async getUnreadCount() {
    const { data } = await api.get('/alerts/unread/count');
    return data;
  },

  async markAsRead(alertId) {
    const { data } = await api.put(`/alerts/${alertId}/read`);
    return data;
  },

  async markAllRead() {
    const { data } = await api.put('/alerts/read-all');
    return data;
  },

  async delete(alertId) {
    await api.delete(`/alerts/${alertId}`);
  },
};
