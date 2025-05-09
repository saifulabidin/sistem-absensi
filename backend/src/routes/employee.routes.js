const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employee.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');
const { employeeValidation } = require('../utils/validators');
const multer = require('multer');

// Configure multer for in-memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.mimetype === 'application/vnd.ms-excel') {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files are allowed'), false);
    }
  }
});

/**
 * @route   GET /api/employees
 * @desc    Get all employees
 * @access  Private - Admin only
 */
router.get('/', verifyToken, isAdmin, employeeController.getAllEmployees);

/**
 * @route   POST /api/employees/import
 * @desc    Import employees from Excel/CSV
 * @access  Private - Admin only
 */
router.post('/import', verifyToken, isAdmin, upload.single('file'), employeeController.importEmployees);

/**
 * @route   GET /api/employees/export
 * @desc    Export employees to Excel
 * @access  Private - Admin only
 */
router.get('/export', verifyToken, isAdmin, employeeController.exportEmployees);

/**
 * @route   GET /api/employees/:id
 * @desc    Get employee by ID
 * @access  Private - Admin only
 */
router.get('/:id', verifyToken, isAdmin, employeeController.getEmployeeById);

/**
 * @route   POST /api/employees
 * @desc    Create new employee
 * @access  Private - Admin only
 */
router.post('/', 
  verifyToken, 
  isAdmin, 
  validate(employeeValidation.create), 
  employeeController.createEmployee
);

/**
 * @route   PUT /api/employees/:id
 * @desc    Update employee
 * @access  Private - Admin only
 */
router.put('/:id', 
  verifyToken, 
  isAdmin, 
  validate(employeeValidation.update), 
  employeeController.updateEmployee
);

/**
 * @route   DELETE /api/employees/:id
 * @desc    Delete employee
 * @access  Private - Admin only
 */
router.delete('/:id', verifyToken, isAdmin, employeeController.deleteEmployee);

module.exports = router;