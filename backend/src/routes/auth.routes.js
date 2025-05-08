const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Login user
router.post('/login', authController.login);

// Logout user (requires authentication)
router.post('/logout', verifyToken, authController.logout);

// Reset password (does not require authentication)
router.post('/reset-password', authController.resetPassword);

// Get current user information (requires authentication)
router.get('/me', verifyToken, authController.getCurrentUser);

module.exports = router;