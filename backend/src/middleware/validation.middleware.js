const { validateRequest } = require('../utils/validators');
const logger = require('../utils/logger');

/**
 * Middleware factory for request data validation
 * @param {Object} schema - Joi validation schema
 * @param {string} source - Request property to validate ('body', 'query', 'params')
 * @returns {Function} Express middleware function
 */
const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const { error, value } = validateRequest(schema, req[source]);
    
    if (error) {
      // Extract error details
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      logger.warn(`Validation error: ${error.message}`, {
        path: req.path,
        method: req.method,
        errors
      });
      
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }
    
    // Replace request data with validated data
    req[source] = value;
    next();
  };
};

module.exports = { validate };