const express = require('express');
const router = express.Router();
const deviceLogController = require('../controllers/deviceLog.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

/**
 * @route   GET /api/device-logs
 * @desc    Get all device logs
 * @access  Private - Admin only
 */
router.get('/', verifyToken, isAdmin, deviceLogController.getDeviceLogs);

/**
 * @route   GET /api/device-logs/export
 * @desc    Export device logs to Excel
 * @access  Private - Admin only
 */
router.get('/export', verifyToken, isAdmin, deviceLogController.exportDeviceLogs);

/**
 * @route   GET /api/device-logs/:userId
 * @desc    Get device logs for a specific user
 * @access  Private - Admin only
 */
router.get('/:userId', verifyToken, isAdmin, deviceLogController.getUserDeviceLogs);

module.exports = router;