import api from './api';

export interface Position {
  id: string;
  name: string;
  level: number;
  created_at: string;
  updated_at: string;
}

class PositionService {
  async getAllPositions() {
    try {
      const response = await api.get('/positions');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getPositionById(id: string) {
    try {
      const response = await api.get(`/positions/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async createPosition(name: string, level: number) {
    try {
      const response = await api.post('/positions', { name, level });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updatePosition(id: string, data: { name?: string; level?: number }) {
    try {
      const response = await api.put(`/positions/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async deletePosition(id: string) {
    try {
      const response = await api.delete(`/positions/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new PositionService();
