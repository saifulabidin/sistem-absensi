const jwt = require('jsonwebtoken');
const { User, DeviceLog } = require('../models');

// Login user and return token
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate request
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({ where: { email } });
    
    // Check if user exists
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Validate password
    const isPasswordValid = await user.validatePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'your-default-secret',
      { expiresIn: '24h' }
    );

    // Collect device information for logging
    const deviceInfo = {
      user_id: user.id,
      device_id: req.body.device_id || 'unknown',
      device_name: req.body.device_name || 'unknown',
      device_model: req.body.device_model || 'unknown',
      login_time: new Date(),
      ip_address: req.ip || req.connection.remoteAddress,
      location_lat: req.body.latitude,
      location_long: req.body.longitude
    };

    // Log device information
    await DeviceLog.create(deviceInfo);

    // Return user information with token
    return res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token
    });
  } catch (error) {
    next(error);
  }
};

// Logout user
const logout = async (req, res, next) => {
  try {
    // Find active device log and update logout time
    const deviceLog = await DeviceLog.findOne({
      where: { 
        user_id: req.userId,
        logout_time: null
      },
      order: [['login_time', 'DESC']]
    });

    if (deviceLog) {
      deviceLog.logout_time = new Date();
      await deviceLog.save();
    }

    return res.status(200).json({ message: 'Successfully logged out' });
  } catch (error) {
    next(error);
  }
};

// Reset password
const resetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      // Don't reveal that the user doesn't exist
      return res.status(200).json({ message: 'If your email is registered, you will receive a reset link shortly' });
    }

    // In a real application, send an email with reset link
    // For now, we'll just return a success message
    return res.status(200).json({ 
      message: 'If your email is registered, you will receive a reset link shortly'
    });
  } catch (error) {
    next(error);
  }
};

// Get current user information
const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: { exclude: ['password'] },
      include: [
        { association: 'position' },
        { association: 'department' }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  logout,
  resetPassword,
  getCurrentUser
};