import api from './api';

const tripService = {
  getAll: async (params = {}) => {
    const response = await api.get('/trips', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/trips/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/trips', data);
    return response.data;
  },

  // PATCH /trips/:id/dispatch — re-validates availability server-side
  dispatch: async (id) => {
    const response = await api.patch(`/trips/${id}/dispatch`);
    return response.data;
  },

  // PATCH /trips/:id/complete — requires actual_distance & fuel_consumed
  complete: async (id, { actual_distance, fuel_consumed }) => {
    const response = await api.patch(`/trips/${id}/complete`, { actual_distance, fuel_consumed });
    return response.data;
  },

  // PATCH /trips/:id/cancel — valid from draft or dispatched
  cancel: async (id) => {
    const response = await api.patch(`/trips/${id}/cancel`);
    return response.data;
  },

  // DELETE /trips/:id — only if status=draft, fleet_manager only
  remove: async (id) => {
    const response = await api.delete(`/trips/${id}`);
    return response.data;
  },
};

export default tripService;
