const winston = require('winston');
const path = require('path');

// Define log file paths
const logDirectory = path.join(__dirname, '../../logs');

// Configure logger with three transports: console, file for all logs, file for errors only
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'attendance-system' },
  transports: [
    // Console transport for all logs
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(
          info => `${info.timestamp} ${info.level}: ${info.message}${info.stack ? '\n' + info.stack : ''}`
        )
      )
    }),
    // File transport for all logs
    new winston.transports.File({ 
      filename: path.join(logDirectory, 'combined.log'),
      maxsize: 10485760, // 10MB
      maxFiles: 5
    }),
    // File transport for error logs only
    new winston.transports.File({ 
      filename: path.join(logDirectory, 'error.log'), 
      level: 'error',
      maxsize: 10485760, // 10MB
      maxFiles: 5
    })
  ],
  // Handle uncaught exceptions
  exceptionHandlers: [
    new winston.transports.File({ 
      filename: path.join(logDirectory, 'exceptions.log'),
      maxsize: 10485760, // 10MB
      maxFiles: 5
    })
  ],
  exitOnError: false
});

module.exports = logger;