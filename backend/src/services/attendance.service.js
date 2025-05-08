const { AttendanceLog, User, Department } = require('../models');
const { Op } = require('sequelize');
const logger = require('../utils/logger');

/**
 * Create a clock-in record for a user
 * @param {string} userId - User ID
 * @param {Object} data - Additional data including notes and location
 * @returns {Promise<Object>} Created attendance log
 */
const createClockIn = async (userId, data = {}) => {
  try {
    // Check if user has already clocked in today
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
    
    // Create new attendance log
    const attendanceLog = await AttendanceLog.create({
      user_id: userId,
      clock_in: new Date(),
      notes: data.notes || '',
      location_lat: data.location ? data.location.latitude : null,
      location_long: data.location ? data.location.longitude : null,
      status: 'present' // Default status, can be updated later based on rules
    });
    
    logger.info(`User ${userId} clocked in at ${attendanceLog.clock_in}`);
    
    return attendanceLog;
  } catch (error) {
    logger.error(`Clock-in error for user ${userId}: ${error.message}`);
    throw error;
  }
};

/**
 * Create a clock-out record for a user
 * @param {string} userId - User ID
 * @param {Object} data - Additional data including notes
 * @returns {Promise<Object>} Updated attendance log
 */
const createClockOut = async (userId, data = {}) => {
  try {
    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Find the latest clock-in for today that doesn't have a clock-out
    const attendanceLog = await AttendanceLog.findOne({
      where: {
        user_id: userId,
        clock_in: {
          [Op.gte]: today,
          [Op.lt]: tomorrow
        },
        clock_out: null
      }
    });
    
    if (!attendanceLog) {
      throw new Error('No active clock-in found for today');
    }
    
    // Update with clock-out time
    const clockOutTime = new Date();
    
    // Calculate work hours
    const clockInTime = new Date(attendanceLog.clock_in);
    const workHours = (clockOutTime - clockInTime) / (1000 * 60 * 60); // in hours
    
    // Update the record
    attendanceLog.clock_out = clockOutTime;
    attendanceLog.work_hours = parseFloat(workHours.toFixed(2));
    
    if (data.notes) {
      // Append notes if provided
      attendanceLog.notes = attendanceLog.notes 
        ? `${attendanceLog.notes}\n${data.notes}` 
        : data.notes;
    }
    
    await attendanceLog.save();
    
    logger.info(`User ${userId} clocked out at ${clockOutTime}. Work hours: ${workHours.toFixed(2)}`);
    
    return attendanceLog;
  } catch (error) {
    logger.error(`Clock-out error for user ${userId}: ${error.message}`);
    throw error;
  }
};

/**
 * Get attendance logs with filtering options
 * @param {Object} options - Filter options
 * @returns {Promise<Array>} Filtered attendance logs
 */
const getAttendanceLogs = async (options = {}) => {
  try {
    const { userId, startDate, endDate, status, limit } = options;
    
    // Build where clause
    let whereClause = {};
    
    // Filter by user ID if provided
    if (userId) {
      whereClause.user_id = userId;
    }
    
    // Filter by date range if provided
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
    
    // Filter by status if provided
    if (status) {
      whereClause.status = status;
    }
    
    // Fetch logs with user data
    const logs = await AttendanceLog.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email'],
          include: [{ model: Department, attributes: ['id', 'name'] }]
        }
      ],
      order: [['clock_in', 'DESC']],
      limit: limit || undefined
    });
    
    return logs;
  } catch (error) {
    logger.error(`Error fetching attendance logs: ${error.message}`);
    throw error;
  }
};

/**
 * Generate attendance report for a date range
 * @param {Object} options - Report options
 * @returns {Promise<Object>} Report data
 */
const generateAttendanceReport = async (options = {}) => {
  try {
    const { startDate, endDate, departmentId } = options;
    
    if (!startDate || !endDate) {
      throw new Error('Start and end dates are required');
    }
    
    // Convert to Date objects
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Build where clause for users
    let userWhereClause = {};
    if (departmentId) {
      userWhereClause.dept_id = departmentId;
    }
    
    // Fetch users that match criteria
    const users = await User.findAll({
      where: userWhereClause,
      attributes: ['id', 'name', 'email'],
      include: [{ model: Department, attributes: ['id', 'name'] }]
    });
    
    // Build where clause for attendance
    let attendanceWhereClause = {
      clock_in: {
        [Op.between]: [start, end]
      }
    };
    
    // Fetch all attendance records in the date range
    const attendanceLogs = await AttendanceLog.findAll({
      where: attendanceWhereClause,
      order: [['user_id'], ['clock_in']]
    });
    
    // Group by user
    const userAttendance = {};
    users.forEach(user => {
      userAttendance[user.id] = {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          department: user.department ? user.department.name : null
        },
        attendance: [],
        summary: {
          present: 0,
          late: 0,
          absent: 0,
          totalWorkHours: 0
        }
      };
    });
    
    // Populate with attendance data
    attendanceLogs.forEach(log => {
      if (userAttendance[log.user_id]) {
        userAttendance[log.user_id].attendance.push({
          date: log.clock_in,
          clockIn: log.clock_in,
          clockOut: log.clock_out,
          status: log.status,
          workHours: log.work_hours || 0
        });
        
        // Update summary
        userAttendance[log.user_id].summary[log.status]++;
        userAttendance[log.user_id].summary.totalWorkHours += log.work_hours || 0;
      }
    });
    
    // Convert to array for response
    const report = {
      period: {
        start: startDate,
        end: endDate
      },
      users: Object.values(userAttendance)
    };
    
    // Calculate overall statistics
    const overallStats = {
      totalUsers: users.length,
      totalWorkHours: 0,
      averageWorkHoursPerUser: 0,
      presentCount: 0,
      lateCount: 0,
      absentCount: 0
    };
    
    report.users.forEach(user => {
      overallStats.totalWorkHours += user.summary.totalWorkHours;
      overallStats.presentCount += user.summary.present;
      overallStats.lateCount += user.summary.late;
      overallStats.absentCount += user.summary.absent;
    });
    
    if (users.length > 0) {
      overallStats.averageWorkHoursPerUser = 
        parseFloat((overallStats.totalWorkHours / users.length).toFixed(2));
    }
    
    report.statistics = overallStats;
    
    return report;
  } catch (error) {
    logger.error(`Error generating attendance report: ${error.message}`);
    throw error;
  }
};

module.exports = {
  createClockIn,
  createClockOut,
  getAttendanceLogs,
  generateAttendanceReport
};