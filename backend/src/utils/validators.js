const Joi = require('joi');

/**
 * Common validation functions for the application
 */

// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return typeof email === 'string' && emailRegex.test(email);
};

// Validate password strength (at least 6 chars)
const isPasswordStrong = (password) => {
  return typeof password === 'string' && password.length >= 6;
};

// Validate if the provided value is a valid date
const isValidDate = (date) => {
  const timestamp = Date.parse(date);
  return !isNaN(timestamp);
};

// Check if object has required fields
const hasRequiredFields = (obj, requiredFields) => {
  if (!obj || typeof obj !== 'object') return false;
  return requiredFields.every(field => 
    Object.prototype.hasOwnProperty.call(obj, field) && obj[field] !== undefined && obj[field] !== null
  );
};

// Validate coordinates format
const isValidCoordinates = (lat, long) => {
  const latNum = parseFloat(lat);
  const longNum = parseFloat(long);
  
  return !isNaN(latNum) && 
         !isNaN(longNum) && 
         latNum >= -90 && 
         latNum <= 90 && 
         longNum >= -180 && 
         longNum <= 180;
};

// Sanitize string input
const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str.trim();
};

/**
 * Auth validation schemas
 */
const authValidation = {
  // Login validation schema
  login: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'string.empty': 'Email is required',
      'any.required': 'Email is required'
    }),
    password: Joi.string().required().messages({
      'string.empty': 'Password is required',
      'any.required': 'Password is required'
    }),
    device_id: Joi.string().allow('').optional(),
    device_name: Joi.string().allow('').optional(),
    device_model: Joi.string().allow('').optional(),
    latitude: Joi.number().optional(),
    longitude: Joi.number().optional()
  }),

  // Password reset validation schema
  resetPassword: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'string.empty': 'Email is required',
      'any.required': 'Email is required'
    })
  })
};

/**
 * Employee validation schemas
 */
const employeeValidation = {
  // Create employee validation schema
  create: Joi.object({
    name: Joi.string().required().messages({
      'string.empty': 'Name is required',
      'any.required': 'Name is required'
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'string.empty': 'Email is required',
      'any.required': 'Email is required'
    }),
    password: Joi.string().min(6).required().messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 6 characters',
      'any.required': 'Password is required'
    }),
    role: Joi.string().valid('admin', 'employee').default('employee'),
    position_id: Joi.string().uuid().allow(null).optional(),
    dept_id: Joi.string().uuid().allow(null).optional()
  }),

  // Update employee validation schema
  update: Joi.object({
    name: Joi.string().optional(),
    email: Joi.string().email().optional().messages({
      'string.email': 'Please provide a valid email address'
    }),
    password: Joi.string().min(6).optional().messages({
      'string.min': 'Password must be at least 6 characters'
    }),
    role: Joi.string().valid('admin', 'employee').optional(),
    position_id: Joi.string().uuid().allow(null).optional(),
    dept_id: Joi.string().uuid().allow(null).optional()
  })
};

/**
 * Department validation schemas
 */
const departmentValidation = {
  // Create/update department validation schema
  createUpdate: Joi.object({
    name: Joi.string().required().messages({
      'string.empty': 'Department name is required',
      'any.required': 'Department name is required'
    })
  })
};

/**
 * Position validation schemas
 */
const positionValidation = {
  // Create/update position validation schema
  createUpdate: Joi.object({
    name: Joi.string().required().messages({
      'string.empty': 'Position name is required',
      'any.required': 'Position name is required'
    }),
    level: Joi.number().integer().min(1).required().messages({
      'number.base': 'Level must be a number',
      'number.integer': 'Level must be an integer',
      'number.min': 'Level must be at least 1',
      'any.required': 'Level is required'
    })
  })
};

/**
 * Attendance validation schemas
 */
const attendanceValidation = {
  // Clock-in validation schema
  clockIn: Joi.object({
    notes: Joi.string().allow('').optional(),
    location: Joi.object({
      latitude: Joi.number().required(),
      longitude: Joi.number().required()
    }).optional()
  }),

  // Clock-out validation schema
  clockOut: Joi.object({
    notes: Joi.string().allow('').optional()
  }),

  // Attendance report validation schema
  report: Joi.object({
    startDate: Joi.date().iso().required().messages({
      'date.base': 'Start date must be a valid date',
      'any.required': 'Start date is required'
    }),
    endDate: Joi.date().iso().required().messages({
      'date.base': 'End date must be a valid date',
      'any.required': 'End date is required'
    }),
    departmentId: Joi.string().uuid().optional()
  })
};

/**
 * Validate request data against schema
 * @param {Object} schema - Joi validation schema
 * @param {Object} data - Request data to validate
 * @returns {Object} - Validation result with error or value
 */
const validateRequest = (schema, data) => {
  const options = {
    abortEarly: false, // Return all errors
    allowUnknown: true, // Allow unknown properties
    stripUnknown: true // Remove unknown properties
  };

  return schema.validate(data, options);
};

module.exports = {
  isValidEmail,
  isPasswordStrong,
  isValidDate,
  hasRequiredFields,
  isValidCoordinates,
  sanitizeString,
  authValidation,
  employeeValidation,
  departmentValidation,
  positionValidation,
  attendanceValidation,
  validateRequest
};