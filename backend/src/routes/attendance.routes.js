const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendance.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');
const { attendanceValidation } = require('../utils/validators');

/**
 * @route   POST /api/attendance/clock-in
 * @desc    Clock in for employee
 * @access  Private
 */
router.post('/clock-in', 
  verifyToken, 
  validate(attendanceValidation.clockIn),
  attendanceController.clockIn
);

/**
 * @route   PUT /api/attendance/clock-out
 * @desc    Clock out for employee
 * @access  Private
 */
router.put('/clock-out', 
  verifyToken, 
  validate(attendanceValidation.clockOut),
  attendanceController.clockOut
);

/**
 * @route   GET /api/attendance
 * @desc    Get attendance logs (admin: all logs, employee: own logs only)
 * @access  Private
 */
router.get('/', verifyToken, attendanceController.getAttendanceLogs);

/**
 * @route   GET /api/attendance/report
 * @desc    Get attendance report with statistics
 * @access  Private - Admin only
 */
router.get('/report', 
  verifyToken, 
  isAdmin, 
  validate(attendanceValidation.report, 'query'),
  attendanceController.getAttendanceReport
);

/**
 * @route   GET /api/attendance/export
 * @desc    Export attendance logs to Excel
 * @access  Private - Admin only
 */
router.get('/export', 
  verifyToken, 
  isAdmin, 
  validate(attendanceValidation.report, 'query'),
  attendanceController.exportAttendanceReport
);

/**
 * @route   GET /api/attendance/:id
 * @desc    Get attendance log by ID
 * @access  Private
 */
router.get('/:id', verifyToken, attendanceController.getAttendanceById);

module.exports = router;