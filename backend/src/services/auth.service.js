const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, DeviceLog } = require('../models');
const logger = require('../utils/logger');

/**
 * Authentication Service for user authentication operations
 */
class AuthService {
  /**
   * Authenticate user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} User data with token
   * @throws {Error} If authentication fails
   */
  async authenticate(email, password) {
    try {
      // Find user by email
      const user = await User.findOne({ where: { email } });
      
      // Check if user exists
      if (!user) {
        logger.warn(`Authentication failed: User with email ${email} not found`);
        throw new Error('Invalid email or password');
      }

      // Validate password
      const isPasswordValid = await user.validatePassword(password);
      
      if (!isPasswordValid) {
        logger.warn(`Authentication failed: Invalid password for ${email}`);
        throw new Error('Invalid email or password');
      }

      // Generate JWT token
      const token = this.generateToken(user);
      
      logger.info(`User authenticated successfully: ${email}`);
      
      // Return user data and token
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token
      };
    } catch (error) {
      logger.error(`Authentication error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Register a device login for a user
   * @param {string} userId - User ID
   * @param {Object} deviceInfo - Device information
   * @returns {Promise<Object>} Created device log
   */
  async logDeviceAccess(userId, deviceInfo) {
    try {
      const deviceLog = await DeviceLog.create({
        user_id: userId,
        device_id: deviceInfo.device_id || 'unknown',
        device_name: deviceInfo.device_name || 'unknown',
        device_model: deviceInfo.device_model || 'unknown',
        login_time: new Date(),
        ip_address: deviceInfo.ip_address || 'unknown',
        location_lat: deviceInfo.location_lat,
        location_long: deviceInfo.location_long
      });
      
      logger.info(`Device access logged for user ${userId}`);
      return deviceLog;
    } catch (error) {
      logger.error(`Error logging device access: ${error.message}`);
      throw error;
    }
  }

  /**
   * Update device log with logout time
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Updated device log
   */
  async logDeviceLogout(userId) {
    try {
      // Find the most recent active device log for this user
      const deviceLog = await DeviceLog.findOne({
        where: { 
          user_id: userId,
          logout_time: null
        },
        order: [['login_time', 'DESC']]
      });
      
      if (!deviceLog) {
        logger.warn(`No active device log found for user ${userId}`);
        return null;
      }
      
      // Update logout time
      deviceLog.logout_time = new Date();
      await deviceLog.save();
      
      logger.info(`Device logout logged for user ${userId}`);
      return deviceLog;
    } catch (error) {
      logger.error(`Error logging device logout: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generate JWT token for a user
   * @param {Object} user - User object
   * @returns {string} JWT token
   */
  generateToken(user) {
    return jwt.sign(
      { 
        id: user.id, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'your-default-secret',
      { 
        expiresIn: process.env.JWT_EXPIRY || '24h' 
      }
    );
  }

  /**
   * Verify JWT token
   * @param {string} token - JWT token
   * @returns {Object} Decoded token payload
   * @throws {Error} If token is invalid
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET || 'your-default-secret');
    } catch (error) {
      logger.error(`Token verification error: ${error.message}`);
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Initiate password reset process
   * @param {string} email - User email
   * @returns {Promise<boolean>} Success status
   */
  async initiatePasswordReset(email) {
    try {
      const user = await User.findOne({ where: { email } });
      
      if (!user) {
        // For security, we don't reveal that the user doesn't exist
        logger.warn(`Password reset attempted for non-existent user: ${email}`);
        return true;
      }
      
      // In a real application, generate a reset token and send email
      // For now, we'll just log it
      logger.info(`Password reset initiated for user ${email}`);
      
      return true;
    } catch (error) {
      logger.error(`Password reset error: ${error.message}`);
      throw error;
    }
  }
}

/**
 * Hash a password
 * @param {string} password - Plain text password
 * @returns {string} Hashed password
 */
const hashPassword = async (password) => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

/**
 * Create a new user
 * @param {Object} userData - User data
 * @returns {Object} Created user
 */
const createUser = async (userData) => {
  try {
    // Hash the password
    const hashedPassword = await hashPassword(userData.password);
    
    // Create user with hashed password
    const user = await User.create({
      ...userData,
      password: hashedPassword
    });

    return user;
  } catch (error) {
    logger.error('User creation failed:', error);
    throw error;
  }
};

module.exports = {
  AuthService: new AuthService(),
  hashPassword,
  createUser
};