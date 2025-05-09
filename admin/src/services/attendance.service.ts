import api from './api';

export interface AttendanceLog {
  id: string;
  user_id: string;
  clock_in: string;
  clock_out?: string;
  work_hours?: number;
  status: 'present' | 'late' | 'absent';
  notes?: string;
  location_lat?: number;
  location_long?: number;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface AttendanceReportParams {
  startDate: string;
  endDate: string;
  departmentId?: string;
}

class AttendanceService {
  async getAttendanceLogs(params?: {
    startDate?: string;
    endDate?: string;
    userId?: string;
    status?: string;
    limit?: number;
  }) {
    try {
      const response = await api.get('/attendance', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getAttendanceById(id: string) {
    try {
      const response = await api.get(`/attendance/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getAttendanceReport(params: AttendanceReportParams) {
    try {
      const response = await api.get('/attendance/report', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async exportAttendanceReport(params: AttendanceReportParams & { format?: string; detailed?: boolean }) {
    try {
      const response = await api.get('/attendance/export', { 
        params,
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new AttendanceService();
