const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth.routes');
const employeeRoutes = require('./routes/employee.routes');
const departmentRoutes = require('./routes/department.routes');
const positionRoutes = require('./routes/position.routes');
const attendanceRoutes = require('./routes/attendance.routes');
const deviceLogRoutes = require('./routes/deviceLog.routes');

// Import error handler middleware
const errorHandler = require('./middleware/error.middleware');

// Initialize database connection
const db = require('./config/database');

// Create Express app
const app = express();

// Set port
const PORT = process.env.PORT || 5000;

// Middleware
const corsOptions = {
  origin: '*', // During development, you can use '*' to accept any origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Attendance System API' });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/positions', positionRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/device-logs', deviceLogRoutes);

// Error handling middleware
app.use(errorHandler);

// Test database connection and sync models
db.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
    return db.sync(); // This creates the tables if they don't exist
  })
  .then(() => {
    console.log('Database synchronized successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Export for testing purposes
module.exports = app;