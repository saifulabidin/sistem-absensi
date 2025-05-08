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

module.exports = {
  isValidEmail,
  isPasswordStrong,
  isValidDate,
  hasRequiredFields,
  isValidCoordinates,
  sanitizeString
};