const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendance.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

// Clock in (requires authentication)
router.post('/clock-in', verifyToken, attendanceController.clockIn);

// Clock out (requires authentication)
router.put('/clock-out', verifyToken, attendanceController.clockOut);

// Get attendance logs (admin can see all, employees can see their own)
router.get('/', verifyToken, attendanceController.getAttendanceLogs);

// Get specific attendance record (admin can see all, employees can see their own)
router.get('/:id', verifyToken, attendanceController.getAttendanceById);

// Get attendance report (admin only)
router.get('/report', verifyToken, isAdmin, attendanceController.getAttendanceReport);

// Export attendance report (admin only)
router.get('/export', verifyToken, isAdmin, attendanceController.exportAttendanceReport);

module.exports = router;