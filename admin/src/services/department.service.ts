import api from './api';

export interface Department {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

class DepartmentService {
  async getAllDepartments() {
    try {
      const response = await api.get('/departments');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getDepartmentById(id: string) {
    try {
      const response = await api.get(`/departments/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async createDepartment(name: string) {
    try {
      const response = await api.post('/departments', { name });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateDepartment(id: string, name: string) {
    try {
      const response = await api.put(`/departments/${id}`, { name });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteDepartment(id: string) {
    try {
      const response = await api.delete(`/departments/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new DepartmentService();
