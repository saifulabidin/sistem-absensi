const jwt = require('jsonwebtoken');
const { User } = require('../models');
const logger = require('../utils/logger');

/**
 * Middleware to verify JWT token
 * Adds user ID and role to request object if token is valid
 */
const verifyToken = async (req, res, next) => {
  try {
    // Get token from header
    const bearerHeader = req.headers.authorization;
    
    if (!bearerHeader) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    
    // Split bearer from token
    const bearer = bearerHeader.split(' ');
    const token = bearer[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. Invalid token format.' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-default-secret');
    
    // Check if user still exists in database
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: 'User no longer exists.' });
    }
    
    // Add user ID and role to request
    req.userId = decoded.id;
    req.userRole = decoded.role;
    
    next();
  } catch (error) {
    logger.error(`Token validation error: ${error.message}`);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token.' });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired.' });
    }
    
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

/**
 * Middleware to restrict access to admin users only
 */
const isAdmin = (req, res, next) => {
  if (req.userRole !== 'admin') {
    logger.warn(`Unauthorized admin access attempt by user: ${req.userId}`);
    return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
  
  next();
};

/**
 * Middleware to restrict access to employee users only
 */
const isEmployee = (req, res, next) => {
  if (req.userRole !== 'employee') {
    return res.status(403).json({ message: 'Access denied. Employee privileges required.' });
  }
  
  next();
};

/**
 * Middleware to check if user has access to requested user's data
 * Admins can access any user data, employees can only access their own data
 */
const checkUserAccess = (req, res, next) => {
  const requestedUserId = req.params.userId || req.params.id;
  
  if (req.userRole === 'admin') {
    // Admins can access any user's data
    next();
  } else if (req.userId === requestedUserId) {
    // Users can access their own data
    next();
  } else {
    logger.warn(`Unauthorized user access attempt: ${req.userId} tried to access ${requestedUserId}'s data`);
    return res.status(403).json({ message: 'Access denied. You can only access your own data.' });
  }
};

module.exports = {
  verifyToken,
  isAdmin,
  isEmployee,
  checkUserAccess
};