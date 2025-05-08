const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/department.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

// Get all departments
router.get('/', verifyToken, departmentController.getAllDepartments);

// Get department by ID
router.get('/:id', verifyToken, departmentController.getDepartmentById);

// Create new department (admin only)
router.post('/', verifyToken, isAdmin, departmentController.createDepartment);

// Update department (admin only)
router.put('/:id', verifyToken, isAdmin, departmentController.updateDepartment);

// Delete department (admin only)
router.delete('/:id', verifyToken, isAdmin, departmentController.deleteDepartment);

module.exports = router;