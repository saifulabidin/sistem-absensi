const express = require('express');
const router = express.Router();
const deviceLogController = require('../controllers/deviceLog.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

// Get all device logs (admin only)
router.get('/', verifyToken, isAdmin, deviceLogController.getDeviceLogs);

// Get device logs for a specific user (admin only)
router.get('/user/:userId', verifyToken, isAdmin, deviceLogController.getUserDeviceLogs);

// Export device logs (admin only)
router.get('/export', verifyToken, isAdmin, deviceLogController.exportDeviceLogs);

module.exports = router;