import api from './api';

const driverService = {
  getAll: async (params = {}) => {
    const response = await api.get('/drivers', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/drivers/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/drivers', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/drivers/${id}`, data);
    return response.data;
  },

  remove: async (id) => {
    const response = await api.delete(`/drivers/${id}`);
    return response.data;
  },

  // Safety Officer only — PATCH /api/drivers/:id/suspend
  suspend: async (id, reason) => {
    const response = await api.patch(`/drivers/${id}/suspend`, { reason });
    return response.data;
  },
};

export default driverService;
