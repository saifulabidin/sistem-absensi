const { User, AttendanceLog, Department } = require('../models');
const attendanceService = require('../services/attendance.service');
const excelExporter = require('../utils/excelExporter');
const logger = require('../utils/logger');
const { Op } = require('sequelize');

// Handle clock-in
const clockIn = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { 
      notes, 
      latitude, 
      longitude,
      device_id,
      device_name,
      device_model 
    } = req.body;
    
    // Validate location data if provided
    if ((latitude !== undefined && longitude === undefined) || 
        (latitude === undefined && longitude !== undefined)) {
      return res.status(400).json({ 
        message: "Both latitude and longitude must be provided together" 
      });
    }
    
    // Create device log if device info is provided
    if (device_id || device_name || device_model) {
      try {
        const DeviceLog = require('../models').DeviceLog;
        await DeviceLog.create({
          user_id: userId,
          device_id: device_id || 'unknown',
          device_name: device_name || 'unknown',
          device_model: device_model || 'unknown',
          ip_address: req.ip || 'unknown',
          login_time: new Date(),
          location: (latitude && longitude) ? { type: 'Point', coordinates: [longitude, latitude] } : null
        });
      } catch (deviceError) {
        logger.error('Error creating device log:', deviceError);
        // Don't fail the entire request if device log fails
      }
    }
    
    const attendanceLog = await attendanceService.createClockIn(userId, { 
      notes,
      latitude,
      longitude 
    });
    
    return res.status(201).json({
      message: "Clock-in successful",
      data: attendanceLog
    });
  } catch (error) {
    logger.error('Clock-in error:', error);
    
    // Handle specific errors
    if (error.message === 'You have already clocked in today') {
      return res.status(400).json({ message: error.message });
    }
    
    return res.status(500).json({ message: "Error processing clock-in", error: error.message });
  }
};

// Handle clock-out
const clockOut = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { 
      notes, 
      latitude, 
      longitude,
      device_id,
      device_name,
      device_model 
    } = req.body;
    
    // Validate location data if provided
    if ((latitude !== undefined && longitude === undefined) || 
        (latitude === undefined && longitude !== undefined)) {
      return res.status(400).json({ 
        message: "Both latitude and longitude must be provided together" 
      });
    }
    
    // Update device log if device info is provided
    if (device_id || device_name || device_model) {
      try {
        const DeviceLog = require('../models').DeviceLog;
        const latestDeviceLog = await DeviceLog.findOne({
          where: { 
            user_id: userId,
            logout_time: null
          },
          order: [['login_time', 'DESC']]
        });
        
        if (latestDeviceLog) {
          latestDeviceLog.logout_time = new Date();
          await latestDeviceLog.save();
        }
      } catch (deviceError) {
        logger.error('Error updating device log:', deviceError);
        // Don't fail the entire request if device log update fails
      }
    }
    
    const attendanceLog = await attendanceService.createClockOut(userId, { 
      notes,
      latitude,
      longitude 
    });
    
    return res.status(200).json({
      message: "Clock-out successful",
      data: attendanceLog
    });
  } catch (error) {
    logger.error('Clock-out error:', error);
    
    // Handle specific errors
    if (error.message === 'No active clock-in found for today') {
      return res.status(400).json({ message: error.message });
    }
    
    return res.status(500).json({ message: "Error processing clock-out", error: error.message });
  }
};

// Get attendance logs
const getAttendanceLogs = async (req, res, next) => {
  try {
    const { startDate, endDate, status, limit } = req.query;
    let userId = req.query.userId;
    
    // If not admin, restrict to own records
    if (req.userRole !== 'admin' && userId !== req.userId) {
      userId = req.userId;
    }
    
    const logs = await attendanceService.getAttendanceLogs({
      userId,
      startDate,
      endDate,
      status,
      limit: parseInt(limit) || undefined
    });
    
    return res.status(200).json(logs);
  } catch (error) {
    logger.error('Get attendance logs error:', error);
    next(error);
  }
};

// Get attendance by ID
const getAttendanceById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const attendanceLog = await AttendanceLog.findByPk(id, {
      include: [{
        model: User,
        attributes: ['id', 'name', 'email'],
        include: [{ model: Department, attributes: ['name'] }]
      }]
    });
    
    if (!attendanceLog) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    
    // If not admin, ensure record belongs to requesting user
    if (req.userRole !== 'admin' && attendanceLog.user_id !== req.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    return res.status(200).json(attendanceLog);
  } catch (error) {
    logger.error('Get attendance by ID error:', error);
    next(error);
  }
};

// Get attendance report
const getAttendanceReport = async (req, res, next) => {
  try {
    const { startDate, endDate, departmentId } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start and end dates are required' });
    }
    
    const report = await attendanceService.generateAttendanceReport({
      startDate,
      endDate,
      departmentId
    });
    
    return res.status(200).json(report);
  } catch (error) {
    logger.error('Get attendance report error:', error);
    next(error);
  }
};

// Export attendance report
const exportAttendanceReport = async (req, res, next) => {
  try {
    const { startDate, endDate, departmentId, format } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start and end dates are required' });
    }
    
    const report = await attendanceService.generateAttendanceReport({
      startDate,
      endDate,
      departmentId
    });
    
    // If format is not specified or is not Excel, return JSON
    if (!format || format.toLowerCase() !== 'excel') {
      return res.status(200).json({
        exportedAt: new Date(),
        report
      });
    }
    
    // Generate Excel file
    const excelBuffer = await excelExporter.generateAttendanceReport(report, {
      includeDetailedLogs: req.query.detailed === 'true'
    });
    
    // Set headers for Excel download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=attendance-report-${startDate}-to-${endDate}.xlsx`);
    res.setHeader('Content-Length', excelBuffer.length);
    
    // Send the Excel file
    return res.send(excelBuffer);
  } catch (error) {
    logger.error('Export attendance report error:', error);
    next(error);
  }
};

module.exports = {
  clockIn,
  clockOut,
  getAttendanceLogs,
  getAttendanceById,
  getAttendanceReport,
  exportAttendanceReport
};