const logger = require('../utils/logger');

/**
 * Error handling middleware
 * Catches all errors thrown during request processing
 */
const errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error(`${err.name}: ${err.message}`, { 
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip
  });

  // Default error values
  let statusCode = 500;
  let message = 'Internal Server Error';

  // Handle Sequelize errors
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 400;
    message = err.errors.map(e => e.message).join(', ');
  } 
  // Handle JWT errors
  else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Invalid or expired token';
  }
  // Handle custom errors with status code
  else if (err.statusCode) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Return error response
  res.status(statusCode).json({
    success: false,
    message
  });
};

module.exports = errorHandler;