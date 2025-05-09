import api from './api';

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  position?: {
    id: string;
    name: string;
  };
  department?: {
    id: string;
    name: string;
  };
}

export interface CreateEmployeeDto {
  name: string;
  email: string;
  password: string;
  role?: string;
  position_id?: string;
  dept_id?: string;
}

export interface UpdateEmployeeDto {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  position_id?: string;
  dept_id?: string;
}

class EmployeeService {
  async getAllEmployees() {
    try {
      const response = await api.get('/employees');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getEmployeeById(id: string) {
    try {
      const response = await api.get(`/employees/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async createEmployee(employee: CreateEmployeeDto) {
    try {
      const response = await api.post('/employees', employee);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateEmployee(id: string, employee: UpdateEmployeeDto) {
    try {
      const response = await api.put(`/employees/${id}`, employee);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteEmployee(id: string) {
    try {
      const response = await api.delete(`/employees/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async exportEmployees(format = 'excel') {
    try {
      const response = await api.get(`/employees/export?format=${format}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async importEmployees(file: File) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post('/employees/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new EmployeeService();
