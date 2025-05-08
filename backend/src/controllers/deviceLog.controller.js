const { DeviceLog, User } = require('../models');
const { Op } = require('sequelize');
const excelExporter = require('../utils/excelExporter');
const logger = require('../utils/logger');

// Get all device logs (admin only)
const getDeviceLogs = async (req, res, next) => {
  try {
    const { startDate, endDate, limit } = req.query;

    // Build where clause for filtering
    let whereClause = {};
    
    // Filter by date range if provided
    if (startDate && endDate) {
      whereClause.login_time = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    } else if (startDate) {
      whereClause.login_time = {
        [Op.gte]: new Date(startDate)
      };
    } else if (endDate) {
      whereClause.login_time = {
        [Op.lte]: new Date(endDate)
      };
    }
    
    // Fetch device logs with associations
    const deviceLogs = await DeviceLog.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email', 'role']
        }
      ],
      order: [['login_time', 'DESC']],
      limit: limit ? parseInt(limit) : undefined
    });

    return res.status(200).json(deviceLogs);
  } catch (error) {
    logger.error('Error getting device logs:', error);
    next(error);
  }
};

// Get device logs for a specific user (admin only)
const getUserDeviceLogs = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate, limit } = req.query;

    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Build where clause for filtering
    let whereClause = { user_id: userId };
    
    // Filter by date range if provided
    if (startDate && endDate) {
      whereClause.login_time = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    } else if (startDate) {
      whereClause.login_time = {
        [Op.gte]: new Date(startDate)
      };
    } else if (endDate) {
      whereClause.login_time = {
        [Op.lte]: new Date(endDate)
      };
    }
    
    // Fetch device logs for the user
    const deviceLogs = await DeviceLog.findAll({
      where: whereClause,
      order: [['login_time', 'DESC']],
      limit: limit ? parseInt(limit) : undefined
    });

    return res.status(200).json(deviceLogs);
  } catch (error) {
    logger.error('Error getting user device logs:', error);
    next(error);
  }
};

// Export device logs (admin only)
const exportDeviceLogs = async (req, res, next) => {
  try {
    const { startDate, endDate, userId, format } = req.query;

    // Build where clause for filtering
    let whereClause = {};
    
    // Filter by user if provided
    if (userId) {
      whereClause.user_id = userId;
    }
    
    // Filter by date range if provided
    if (startDate && endDate) {
      whereClause.login_time = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    } else if (startDate) {
      whereClause.login_time = {
        [Op.gte]: new Date(startDate)
      };
    } else if (endDate) {
      whereClause.login_time = {
        [Op.lte]: new Date(endDate)
      };
    }
    
    // Fetch device logs with user information
    const deviceLogs = await DeviceLog.findAll({
      where: whereClause,
      include: [{
        model: User,
        attributes: ['id', 'name', 'email', 'role']
      }],
      order: [['login_time', 'DESC']]
    });
    
    // If format is not specified or is not Excel, return JSON
    if (!format || format.toLowerCase() !== 'excel') {
      return res.status(200).json({
        exportedAt: new Date(),
        logs: deviceLogs
      });
    }
    
    // Generate Excel file
    const excelBuffer = await excelExporter.generateDeviceLogsReport(deviceLogs);
    
    // Create a descriptive filename
    let filename = 'device-logs';
    if (userId) filename += `-user-${userId}`;
    if (startDate) filename += `-from-${startDate}`;
    if (endDate) filename += `-to-${endDate}`;
    filename += '.xlsx';
    
    // Set headers for Excel download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.setHeader('Content-Length', excelBuffer.length);
    
    // Send the Excel file
    return res.send(excelBuffer);
  } catch (error) {
    logger.error('Error exporting device logs:', error);
    next(error);
  }
};

module.exports = {
  getDeviceLogs,
  getUserDeviceLogs,
  exportDeviceLogs
};