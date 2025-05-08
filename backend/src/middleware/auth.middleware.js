const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

/**
 * Middleware to verify JWT token
 * Extracts the user ID and role from the JWT token
 */
const verifyToken = (req, res, next) => {
  // Get the token from authorization header
  const bearerHeader = req.headers.authorization;

  if (!bearerHeader) {
    return res.status(401).json({ message: 'Authorization header is required' });
  }

  // Format should be "Bearer [token]"
  const bearer = bearerHeader.split(' ');
  if (bearer.length !== 2 || bearer[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Invalid token format' });
  }

  const token = bearer[1];

  try {
    // Verify token using JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-default-secret');
    
    // Add user ID and role to request object
    req.userId = decoded.id;
    req.userRole = decoded.role;
    
    next();
  } catch (error) {
    logger.error('Token verification failed:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

/**
 * Middleware to verify that user is an admin
 * Must be used after verifyToken
 */
const isAdmin = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
  next();
};

module.exports = {
  verifyToken,
  isAdmin
};