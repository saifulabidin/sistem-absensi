const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employee.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

// Get all employees (admin only)
router.get('/', verifyToken, isAdmin, employeeController.getAllEmployees);

// Get employee by ID
router.get('/:id', verifyToken, employeeController.getEmployeeById);

// Create new employee (admin only)
router.post('/', verifyToken, isAdmin, employeeController.createEmployee);

// Update employee (admin only)
router.put('/:id', verifyToken, isAdmin, employeeController.updateEmployee);

// Delete employee (admin only)
router.delete('/:id', verifyToken, isAdmin, employeeController.deleteEmployee);

// Import employees from file (admin only)
router.post('/import', verifyToken, isAdmin, employeeController.importEmployees);

// Export employees (admin only)
router.get('/export', verifyToken, isAdmin, employeeController.exportEmployees);

module.exports = router;