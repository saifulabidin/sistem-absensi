const express = require('express');
const router = express.Router();
const positionController = require('../controllers/position.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');
const { positionValidation } = require('../utils/validators');

/**
 * @route   GET /api/positions
 * @desc    Get all positions
 * @access  Private
 */
router.get('/', verifyToken, positionController.getAllPositions);

/**
 * @route   GET /api/positions/:id
 * @desc    Get position by ID
 * @access  Private
 */
router.get('/:id', verifyToken, positionController.getPositionById);

/**
 * @route   POST /api/positions
 * @desc    Create new position
 * @access  Private - Admin only
 */
router.post('/', 
  verifyToken, 
  isAdmin, 
  validate(positionValidation.createUpdate),
  positionController.createPosition
);

/**
 * @route   PUT /api/positions/:id
 * @desc    Update position
 * @access  Private - Admin only
 */
router.put('/:id', 
  verifyToken, 
  isAdmin, 
  validate(positionValidation.createUpdate),
  positionController.updatePosition
);

/**
 * @route   DELETE /api/positions/:id
 * @desc    Delete position
 * @access  Private - Admin only
 */
router.delete('/:id', verifyToken, isAdmin, positionController.deletePosition);

module.exports = router;