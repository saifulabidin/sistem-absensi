const express = require('express');
const router = express.Router();
const positionController = require('../controllers/position.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

// Get all positions
router.get('/', verifyToken, positionController.getAllPositions);

// Get position by ID
router.get('/:id', verifyToken, positionController.getPositionById);

// Create new position (admin only)
router.post('/', verifyToken, isAdmin, positionController.createPosition);

// Update position (admin only)
router.put('/:id', verifyToken, isAdmin, positionController.updatePosition);

// Delete position (admin only)
router.delete('/:id', verifyToken, isAdmin, positionController.deletePosition);

module.exports = router;