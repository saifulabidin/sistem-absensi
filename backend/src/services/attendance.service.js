const { User, AttendanceLog, Department } = require('../models');
const { Op } = require('sequelize');
const logger = require('../utils/logger');

/**
 * Service class for attendance operations
 */
class AttendanceService {
  /**
   * Create a clock-in record for a user
   * @param {string} userId - The user ID
   * @param {Object} data - Additional data for the clock-in
   * @returns {Promise<Object>} Created attendance log
   */
  async createClockIn(userId, data = {}) {
    try {
      // Check if user already clocked in today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const existingClockIn = await AttendanceLog.findOne({
        where: {
          user_id: userId,
          clock_in: {
            [Op.gte]: today,
            [Op.lt]: tomorrow
          }
        }
      });
      
      if (existingClockIn) {
        throw new Error('You have already clocked in today');
      }
      
      // Determine status (on-time or late)
      const now = new Date();
      const workStartTime = new Date();
      workStartTime.setHours(9, 0, 0, 0); // Assuming work starts at 9:00 AM
      
      let status = 'present';
      if (now > workStartTime) {
        // If more than 15 minutes late, mark as late
        const lateThreshold = new Date(workStartTime);
        lateThreshold.setMinutes(lateThreshold.getMinutes() + 15);
        
        if (now > lateThreshold) {
          status = 'late';
        }
      }
      
      // Extract location data
      let location_lat = null;
      let location_long = null;
      
      if (data.latitude !== undefined && data.longitude !== undefined) {
        location_lat = data.latitude;
        location_long = data.longitude;
      }
      
      // Create clock-in record
      const attendanceLog = await AttendanceLog.create({
        user_id: userId,
        clock_in: now,
        status,
        notes: data.notes || null,
        location_lat,
        location_long
      });
      
      logger.info(`User ${userId} clocked in at ${now.toISOString()}`);
      
      return attendanceLog;
    } catch (error) {
      logger.error(`Clock-in error for user ${userId}: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Create a clock-out record for a user
   * @param {string} userId - The user ID
   * @param {Object} data - Additional data for the clock-out
   * @returns {Promise<Object>} Updated attendance log
   */
  async createClockOut(userId, data = {}) {
    try {
      // Get today's clock-in record
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const attendanceLog = await AttendanceLog.findOne({
        where: {
          user_id: userId,
          clock_in: {
            [Op.gte]: today,
            [Op.lt]: tomorrow
          },
          clock_out: null // Only get records without a clock-out
        }
      });
      
      if (!attendanceLog) {
        throw new Error('No active clock-in found for today');
      }
      
      // Record clock-out time
      const now = new Date();
      
      // Calculate work hours
      const clockInTime = new Date(attendanceLog.clock_in);
      const workHours = (now - clockInTime) / (1000 * 60 * 60); // Convert ms to hours
      
      // Update attendance log
      attendanceLog.clock_out = now;
      attendanceLog.work_hours = parseFloat(workHours.toFixed(2));
      
      // Add notes if provided
      if (data.notes) {
        attendanceLog.notes = attendanceLog.notes 
          ? `${attendanceLog.notes}\nClock-out: ${data.notes}`
          : `Clock-out: ${data.notes}`;
      }
      
      // Add location data if provided
      if (data.latitude !== undefined && data.longitude !== undefined) {
        // Store checkout location if no location was recorded at clock-in
        // or we could update or add another field for checkout location
        if (attendanceLog.location_lat === null && attendanceLog.location_long === null) {
          attendanceLog.location_lat = data.latitude;
          attendanceLog.location_long = data.longitude;
        } else {
          // Optionally, we could add a new field for checkout location
          // For now, let's add it to notes
          const locationNote = `\nClock-out location: [${data.latitude}, ${data.longitude}]`;
          attendanceLog.notes = attendanceLog.notes 
            ? attendanceLog.notes + locationNote
            : locationNote.trim();
        }
      }
      
      await attendanceLog.save();
      
      logger.info(`User ${userId} clocked out at ${now.toISOString()}, worked ${workHours.toFixed(2)} hours`);
      
      return attendanceLog;
    } catch (error) {
      logger.error(`Clock-out error for user ${userId}: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Get attendance logs with filtering options
   * @param {Object} options - Filter options
   * @returns {Promise<Array>} Array of attendance logs
   */
  async getAttendanceLogs(options = {}) {
    try {
      const { userId, startDate, endDate, status, limit } = options;
      
      // Build where clause
      let whereClause = {};
      
      if (userId) {
        whereClause.user_id = userId;
      }
      
      if (status) {
        whereClause.status = status;
      }
      
      // Add date filters if provided
      if (startDate && endDate) {
        whereClause.clock_in = {
          [Op.between]: [new Date(startDate), new Date(endDate)]
        };
      } else if (startDate) {
        whereClause.clock_in = {
          [Op.gte]: new Date(startDate)
        };
      } else if (endDate) {
        whereClause.clock_in = {
          [Op.lte]: new Date(endDate)
        };
      }
      
      // Get attendance logs with user info
      const attendanceLogs = await AttendanceLog.findAll({
        where: whereClause,
        include: [{
          model: User,
          attributes: ['id', 'name', 'email', 'role'],
          include: [{ model: Department }]
        }],
        order: [['clock_in', 'DESC']],
        limit: limit
      });
      
      return attendanceLogs;
    } catch (error) {
      logger.error(`Error getting attendance logs: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Generate attendance report for a specific period
   * @param {Object} options - Report options
   * @returns {Promise<Object>} Report data
   */
  async generateAttendanceReport(options = {}) {
    try {
      const { startDate, endDate, departmentId } = options;
      
      if (!startDate || !endDate) {
        throw new Error('Start and end dates are required');
      }
      
      // Get all attendance logs for the period
      let whereClause = {
        clock_in: {
          [Op.between]: [new Date(startDate), new Date(endDate)]
        }
      };
      
      // Include department filter if provided
      let userWhereClause = {};
      if (departmentId) {
        userWhereClause.dept_id = departmentId;
      }
      
      const logs = await AttendanceLog.findAll({
        where: whereClause,
        include: [{
          model: User,
          where: userWhereClause,
          attributes: ['id', 'name', 'email', 'role', 'dept_id'],
          include: [{ model: Department }]
        }],
        order: [['clock_in', 'ASC']]
      });
      
      // Calculate statistics
      const totalLogs = logs.length;
      const presentCount = logs.filter(log => log.status === 'present').length;
      const lateCount = logs.filter(log => log.status === 'late').length;
      const absentCount = 0; // This would need to be calculated differently based on expected attendance
      
      let totalWorkHours = 0;
      let averageWorkHours = 0;
      
      logs.forEach(log => {
        if (log.work_hours) {
          totalWorkHours += parseFloat(log.work_hours);
        }
      });
      
      if (totalLogs > 0) {
        averageWorkHours = totalWorkHours / totalLogs;
      }
      
      // Generate report
      const report = {
        dateRange: {
          startDate,
          endDate
        },
        statistics: {
          totalLogs,
          presentCount,
          lateCount,
          absentCount,
          totalWorkHours: parseFloat(totalWorkHours.toFixed(2)),
          averageWorkHours: parseFloat(averageWorkHours.toFixed(2))
        },
        logs
      };
      
      return report;
    } catch (error) {
      logger.error(`Error generating attendance report: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new AttendanceService();