import api from './api';

export interface DeviceLog {
  id: string;
  user_id: string;
  device_id: string;
  device_name: string;
  device_model?: string;
  login_time: string;
  logout_time?: string;
  ip_address?: string;
  latitude?: number;
  longitude?: number;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

class DeviceLogService {
  async getDeviceLogs(params?: {
    startDate?: string;
    endDate?: string;
    limit?: number;
  }) {
    try {
      const response = await api.get('/device-logs', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getUserDeviceLogs(userId: string, params?: {
    startDate?: string;
    endDate?: string;
    limit?: number;
  }) {
    try {
      const response = await api.get(`/device-logs/${userId}`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async exportDeviceLogs(params?: {
    startDate?: string;
    endDate?: string;
    userId?: string;
    format?: string;
  }) {
    try {
      const response = await api.get('/device-logs/export', { 
        params,
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new DeviceLogService();
