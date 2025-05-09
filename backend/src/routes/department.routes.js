const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/department.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');
const { departmentValidation } = require('../utils/validators');

/**
 * @route   GET /api/departments
 * @desc    Get all departments
 * @access  Private
 */
router.get('/', verifyToken, departmentController.getAllDepartments);

/**
 * @route   GET /api/departments/:id
 * @desc    Get department by ID
 * @access  Private
 */
router.get('/:id', verifyToken, departmentController.getDepartmentById);

/**
 * @route   POST /api/departments
 * @desc    Create new department
 * @access  Private - Admin only
 */
router.post('/', 
  verifyToken, 
  isAdmin, 
  validate(departmentValidation.createUpdate),
  departmentController.createDepartment
);

/**
 * @route   PUT /api/departments/:id
 * @desc    Update department
 * @access  Private - Admin only
 */
router.put('/:id', 
  verifyToken, 
  isAdmin, 
  validate(departmentValidation.createUpdate),
  departmentController.updateDepartment
);

/**
 * @route   DELETE /api/departments/:id
 * @desc    Delete department
 * @access  Private - Admin only
 */
router.delete('/:id', verifyToken, isAdmin, departmentController.deleteDepartment);

module.exports = router;